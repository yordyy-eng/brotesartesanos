'use client'

import { useEffect, useRef, useState } from 'react'

const VERTEX_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    v_uv.y = 1.0 - v_uv.y;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// Reveals the logo through a blocky noise threshold that sweeps up with
// u_progress — the logo "grows in" cell by cell instead of a plain fade,
// echoing the "huellas" (tracks) idea without being literal about it.
const FRAGMENT_SRC = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_texture;
  uniform float u_progress;

  float random(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec4 tex = texture2D(u_texture, v_uv);
    float cell = random(floor(v_uv * 28.0));
    float threshold = u_progress * 1.25 - 0.1;
    float reveal = 1.0 - smoothstep(threshold - 0.12, threshold + 0.12, cell);
    gl_FragColor = vec4(tex.rgb, tex.a * reveal);
  }
`

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'hidden' | 'active' | 'fading'>('hidden')
  const [useStaticLogo, setUseStaticLogo] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('huellas-intro-shown')) return
    sessionStorage.setItem('huellas-intro-shown', '1')
    setPhase('active')

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setUseStaticLogo(true)
      const t = setTimeout(() => setPhase('fading'), 700)
      return () => clearTimeout(t)
    }

    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl')
    const program = gl?.createProgram()
    const vertexShader = gl && compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
    const fragmentShader = gl && compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)

    if (!canvas || !gl || !program || !vertexShader || !fragmentShader) {
      setUseStaticLogo(true)
      const t = setTimeout(() => setPhase('fading'), 900)
      return () => clearTimeout(t)
    }

    let raf = 0
    let cancelled = false

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )
    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const progressLoc = gl.getUniformLocation(program, 'u_progress')
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)

    const image = new window.Image()
    image.src = '/logo-huellas.png'
    image.onerror = () => {
      if (!cancelled) {
        setUseStaticLogo(true)
        setPhase('fading')
      }
    }
    image.onload = () => {
      if (cancelled) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const size = Math.round(canvas.clientWidth * dpr)
      canvas.width = size
      canvas.height = size
      gl.viewport(0, 0, size, size)

      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

      const duration = 1400
      const start = performance.now()

      const draw = (now: number) => {
        if (cancelled) return
        const progress = Math.min((now - start) / duration, 1)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
        gl.uniform1f(progressLoc, progress)
        gl.drawArrays(gl.TRIANGLES, 0, 6)

        if (progress < 1) {
          raf = requestAnimationFrame(draw)
        } else {
          setTimeout(() => !cancelled && setPhase('fading'), 350)
        }
      }
      raf = requestAnimationFrame(draw)
    }

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'fading') return
    const t = setTimeout(() => setPhase('hidden'), 500)
    return () => clearTimeout(t)
  }, [phase])

  if (phase === 'hidden') return null

  return (
    <div className={`loading-screen${phase === 'fading' ? ' fading' : ''}`}>
      {useStaticLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="/logo-huellas.png" alt="Huellas de Nahuelbuta" className="loading-screen-logo" />
      ) : (
        <canvas ref={canvasRef} className="loading-screen-canvas" />
      )}
    </div>
  )
}
