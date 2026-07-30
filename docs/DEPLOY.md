# Despliegue en producción

El sitio está desplegado en **https://huellas.adelchen.cl**, en un VPS
compartido de la agencia (Oracle Cloud, Ubuntu 24.04, IP `146.235.246.171`)
que también aloja otros proyectos de adelchen.cl. Este documento es la
referencia operativa: cómo está armado, cómo redesplegar, y un par de
gotchas reales que aparecieron al montarlo.

## Acceso al VPS

```bash
ssh -i /ruta/a/la/llave.key ubuntu@146.235.246.171
```

El proyecto vive en `~/huellas-nahuelbuta` (clon de este repo). El archivo
`~/huellas-nahuelbuta/.env` en el VPS tiene los secretos de producción
(`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `PAYLOAD_SECRET`,
`PAYLOAD_PUBLIC_SERVER_URL`) — **no está commiteado**, es local a ese
servidor. Si hay que recrearlo desde cero, generar un `PAYLOAD_SECRET` nuevo
(no reusar el de desarrollo):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Arquitectura del despliegue

`docker-compose.prod.yml` (en la raíz del repo) define dos servicios,
aislados del resto del VPS:

- `db` — Postgres propio, con su propio volumen (`huellas_pg_data`), en una
  red **interna** (`huellas_internal`) que ningún otro proyecto puede tocar.
- `app` — la imagen construida desde el `Dockerfile` (multi-stage, Next.js en
  modo `output: 'standalone'`), en `huellas_internal` (para hablar con `db`)
  y además en `npm_proxy_net` (red externa compartida, ver abajo).

Ningún puerto se publica al host — todo el tráfico entra vía **Nginx Proxy
Manager** (NPM), que ya corre en este VPS para todos los proyectos.

### Por qué `npm_proxy_net` y no editar el compose de NPM

NPM está conectado a una red externa genérica llamada `npm_proxy_net`
específicamente para que proyectos nuevos se conecten ahí sin necesitar
editar ni reiniciar el propio `docker-compose.yml` de NPM (que si se toca,
afecta a TODOS los proyectos del VPS a la vez). El Proxy Host se configuró
apuntando directo al nombre del contenedor:

```
huellas.adelchen.cl → huellas-nahuelbuta-app-1:3000
```

Esto se hizo vía la API REST de NPM (`http://localhost:81/api`), no a mano
en el panel — ver el historial de esta sesión para los payloads exactos si
hay que repetirlo (crear proxy host, crear certificado Let's Encrypt vía
`/api/nginx/certificates` con `{"provider":"letsencrypt","domain_names":[...],"meta":{"dns_challenge":false}}`,
después `PUT` al proxy host con el `certificate_id` obtenido).

## ⚠️ Gotcha real: un contenedor roto de OTRO proyecto puede bloquear cualquier cambio de NPM

Al configurar esto, `cultura-backend-1` (proyecto no relacionado, Cultura
Angol) estaba en loop de crash por un bug propio
(`column workshops.image_url does not exist`, migración de BD faltante).
Cada vez que NPM necesita recargar nginx (crear/editar CUALQUIER proxy host
o certificado, no solo el de este proyecto), nginx valida **toda** la
configuración de una vez — si el hostname de un contenedor de otro proyecto
no resuelve en ese momento, el reload completo falla con `Internal Error` y
**ningún** cambio de NPM se aplica, ni siquiera en proyectos no relacionados.

No es algo para "arreglar" desde acá (es la app de otro proyecto) — si vuelve
a pasar, la única solución de corto plazo verificada es reintentar el cambio
de NPM justo cuando ese contenedor esté brevemente `Up` entre reinicios, y de
fondo, alguien tiene que arreglar la migración pendiente de Cultura Angol.

## Persistencia

- `huellas_pg_data` (volumen) — datos de Postgres.
- `huellas_media` (volumen, montado en `/app/public/media` del contenedor
  `app`) — uploads hechos desde `/admin` (portadas de artesanos nuevas,
  etc.). Sin este volumen, cualquier upload se perdería al reconstruir la
  imagen.
- El resto de `public/` (PDF, fotos scrapeadas, logos) viene HORNEADO en la
  imagen Docker porque está commiteado al repo — no necesita volumen.

## Por qué las páginas son `force-dynamic`

Las páginas que leen de Payload (`/`, `/brotes-de-chile`, `/historia`,
`/sobre-nosotros`, `/contacto`) tienen `export const dynamic = 'force-dynamic'`
— se renderizan por request, no en el build. Dos razones:
1. Un editor cambia contenido desde `/admin` y lo espera reflejado al
   instante, no después del próximo deploy.
2. Sin esto, `next build` necesitaría una base de datos ya poblada y
   alcanzable EN EL MOMENTO DEL BUILD (porque intentaría prerenderizar esas
   páginas), lo que complica innecesariamente el pipeline de Docker.

## Redesplegar después de un cambio de código

```bash
ssh -i /ruta/a/la/llave.key ubuntu@146.235.246.171
cd ~/huellas-nahuelbuta
git pull origin main
docker compose -f docker-compose.prod.yml build app
docker compose -f docker-compose.prod.yml up -d app
```

`db` no necesita tocarse a menos que cambie el esquema de Payload (los
cambios de colecciones/campos los aplica Payload solo al arrancar `app`).

## Restaurar/migrar datos (artesanos, contenido de los globals)

El contenido (no los archivos de imagen, esos van en git) vive solo en
Postgres. Para llevar datos de un entorno a otro:

```bash
# origen: volcar solo el schema de Payload
docker exec <contenedor-db-origen> pg_dump -U <user> -d <db> --schema=payload -Fc -f /tmp/dump.dump
docker cp <contenedor-db-origen>:/tmp/dump.dump ./dump.dump

# destino: copiar y restaurar
scp -i llave.key ./dump.dump ubuntu@146.235.246.171:~/huellas-nahuelbuta/
ssh -i llave.key ubuntu@146.235.246.171
docker cp ~/huellas-nahuelbuta/dump.dump huellas-nahuelbuta-db-1:/tmp/dump.dump
docker exec huellas-nahuelbuta-db-1 pg_restore -U huellas_user -d huellas_db --no-owner --role=huellas_user -v /tmp/dump.dump
```

## Logs y diagnóstico

```bash
docker logs huellas-nahuelbuta-app-1 --tail 100
docker logs huellas-nahuelbuta-db-1 --tail 100
docker exec huellas-nahuelbuta-db-1 psql -U huellas_user -d huellas_db -c "select count(*) from payload.artisans;"
```

## Certificado SSL

Let's Encrypt vía NPM, autorrenovación maneja NPM internamente (cron propio
del contenedor). Certificado emitido el 2026-07-30, expira 2026-10-28 —
no requiere acción manual salvo que NPM deje de renovarlo solo.
