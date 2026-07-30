# Pipeline de imágenes

Este proyecto usa fotografía real de tres orígenes distintos para los
mosaicos de fondo de cada hero (ver `getHeroPhotoMix()` en
`docs/ARQUITECTURA.md`). Este documento explica de dónde sale cada una, dos
bugs reales que causaron imágenes "en blanco" en producción, y cómo se
resolvieron.

## Los tres orígenes

| Carpeta | Origen | Cantidad |
|---|---|---|
| `public/media/` | Retratos de los 40 artesanos, subidos a Payload | 40 |
| `public/pdf-assets/images/` | Imágenes embebidas extraídas de `CATÁLOGO ARTESANOS 2026.pdf` (artesanía, no retratos) | 385 extraídas, 123 usables tras dedupe/filtro |
| `public/reference/huellas-oficial/` | Fotos reales descargadas del sitio oficial (`huellasdenahuelbuta.cl`) vía `scripts/download_huellas_assets.py` | 497 descargadas, 164 usables |

## Bug #1: JPEG2000 disfrazado de `.jpg`

La extracción de imágenes del PDF (y, en 4 casos, las fotos de portada de
artesanos ya migradas a Payload) produjo archivos con extensión `.jpg` cuyo
contenido real es **JPEG2000** (magic bytes `00 00 00 0c 6a 50 20 20`, no
`FF D8 FF` de un JPEG real) o, en un caso, **TIFF** crudo. `sharp` (la
librería que usa el optimizador de imágenes de Next por debajo) no puede
decodificar JP2/TIFF sin plugins adicionales — el resultado es una imagen que
nunca carga, se ve en blanco.

**Cómo se detectó:** un chequeo por firma de bytes (magic bytes) encontró 87
archivos sospechosos, pero intentar decodificarlos de verdad con
`sharp(path).metadata()` encontró **66 fallos reales** (solapan parcialmente
con los 87 — el chequeo de firma por sí solo no alcanza).

**Cómo se arregló:** Python + Pillow (que sí trae soporte JP2 vía OpenJPEG)
puede leer estos archivos y re-exportarlos como JPEG real. Se recuperaron así
**85 imágenes del PDF** que antes se descartaban en silencio, y se
corrigieron los **4 retratos de artesanos** rotos (Ana María Castro, María
Teresa Véliz, Mariana Rojas, Roberto Vergara) — estos últimos rompían no solo
el mosaico decorativo sino también la propia página de perfil del artesano.
Solo un archivo decorativo (`p35_img06.jpg`, un TIFF duplicado) quedó sin
recuperar por quedar bloqueado por el antivirus/indexador de Windows durante
el intento de sobreescritura — impacto nulo, es un duplicado que de todos
modos quedaría filtrado.

> Si en el futuro se agregan más imágenes al PDF o al scraping y aparecen
> tiles en blanco de nuevo, sospechar primero de esto. Verificar con:
> `python -c "from PIL import Image; im=Image.open('archivo.jpg'); print(im.format)"`
> — si el `format` no es `JPEG`/`PNG` a pesar de la extensión, hay que
> re-exportarlo (`im.convert('RGB').save(path, 'JPEG')`, con cuidado de no
> escribir sobre un archivo que Pillow todavía tiene abierto — ver nota al
> final sobre `os.replace`).

## Bug #2: `sharp` no es seguro dentro de worker threads (Windows)

Después de arreglar el bug anterior, la validación de imágenes se hacía en
tiempo de build/request: cada página llamaba a una función que escaneaba la
carpeta y corría `sharp(file).metadata()` sobre cada candidato para descartar
los que no decodifican. Esto funcionaba perfecto en `next dev`, pero
**`npm run build` crasheaba** con un access violation de Windows (código de
salida `3221226505` / `0xC0000005`) durante "Generating static pages", incluso
forzando un solo worker (`experimental.cpus: 1`).

**Causa raíz:** Next.js genera las páginas estáticas dentro de worker
threads, y `sharp`/libvips explícitamente no soporta ejecutarse ahí — puede
crashear el proceso entero. Confirmado corriendo el mismo escaneo con `sharp`
en un script de Node normal (proceso principal, sin workers): 0 crashes, exit
code 0.

**Solución:** sacar `sharp` del camino de build/request por completo.
`scripts/build-image-manifests.cjs` corre una sola vez, en un proceso de Node
normal (nunca dentro de un worker de Next), escanea ambas carpetas, descarta
duplicados por tamaño de archivo y valida cada candidato con `sharp`, y
escribe el resultado en:

```
src/lib/generated/pdf-images-manifest.json
src/lib/generated/official-site-images-manifest.json
```

`src/lib/pdf-images.ts` y `src/lib/official-site-images.ts` ahora solo
**leen ese JSON** (`import manifest from './generated/....json'`) — no hay
ninguna llamada a `sharp` en el camino de build ni de request. `src/lib/image-validation.ts`
(el chequeo async basado en sharp que se usaba antes) se eliminó por quedar
sin uso.

### Cuándo volver a correr el generador de manifiestos

```bash
node scripts/build-image-manifests.cjs
```

Correr esto de nuevo cada vez que se agreguen o quiten archivos de
`public/pdf-assets/images/` o `public/reference/huellas-oficial/`. Si no se
corre, las imágenes nuevas simplemente no aparecen en los mosaicos (no rompe
nada, solo no se usan) — no hay ningún paso de build que lo dispare
automáticamente todavía.

## Nota práctica: sobreescribir un archivo que Pillow abrió

En Windows, `Image.open(path)` seguido de `.save(path, ...)` sobre el **mismo
path** puede fallar con `OSError: [Errno 22] Invalid argument` porque Pillow
retiene el handle del archivo original abierto. El patrón seguro es:

```python
with Image.open(path) as im:
    im2 = im.convert("RGB")
im2.save(path, "JPEG", quality=92)  # ya fuera del `with`, el handle está cerrado
```

Si además hay otro proceso con el archivo abierto (antivirus escaneando un
archivo grande recién tocado, por ejemplo), incluso esto puede fallar
puntualmente — en ese caso, un pequeño retry con backoff (unos segundos)
suele alcanzar.
