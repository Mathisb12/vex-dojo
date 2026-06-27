import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  // Raw text the player typed for each component — kept as strings so we
  // can show "?" for blanks that haven't been filled in yet.
  xRaw: string
  yRaw: string
  zRaw: string
  height?: number
}

const AXIS_LEN = 1.4
const MAX_DISPLAY_LEN = 2.4

function parseComponent(raw: string): number {
  const n = parseFloat(raw.trim())
  return Number.isNaN(n) ? 0 : n
}

export function VectorArrowViewer({ xRaw, yRaw, zRaw, height = 220 }: Props) {
  const { t } = useLang()
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    arrow: THREE.ArrowHelper
    animId: number
  } | null>(null)

  // Init scene once
  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(el.clientWidth, height)
    renderer.setClearColor(0x0d1117, 1)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, el.clientWidth / height, 0.01, 100)
    camera.position.set(2.2, 1.7, 2.6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1
    controls.maxDistance = 12

    const grid = new THREE.GridHelper(4, 8, 0x30363d, 0x1e2530)
    scene.add(grid)

    // Reference X/Y/Z axes as colored arrows from the origin
    const mkAxis = (dir: THREE.Vector3, color: number) =>
      new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), AXIS_LEN, color, 0.12, 0.06)
    scene.add(mkAxis(new THREE.Vector3(1, 0, 0), 0xef4444))
    scene.add(mkAxis(new THREE.Vector3(0, 1, 0), 0x22c55e))
    scene.add(mkAxis(new THREE.Vector3(0, 0, 1), 0x3b82f6))

    // The vector being typed — updated live in the second effect
    const arrow = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 0.001, 0xf97316, 0.18, 0.09)
    arrow.visible = false
    scene.add(arrow)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = el.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(el)

    stateRef.current = { renderer, camera, controls, arrow, animId }

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [height])

  // Update the arrow when the typed components change
  useEffect(() => {
    const state = stateRef.current
    if (!state) return
    const v = new THREE.Vector3(parseComponent(xRaw), parseComponent(yRaw), parseComponent(zRaw))
    const len = v.length()
    if (len < 1e-4) {
      state.arrow.visible = false
      return
    }
    state.arrow.visible = true
    const shown = Math.min(len, MAX_DISPLAY_LEN)
    state.arrow.setDirection(v.normalize())
    state.arrow.setLength(shown, Math.min(0.18, shown * 0.3), Math.min(0.09, shown * 0.18))
  }, [xRaw, yRaw, zRaw])

  const fmt = (raw: string) => (raw.trim() === '' ? '?' : raw.trim())

  return (
    <div className="relative rounded-lg overflow-hidden border border-vex-border bg-vex-bg">
      <div ref={mountRef} style={{ width: '100%', height }} />
      <div className="absolute bottom-2 left-3 text-vex-muted text-xs font-mono pointer-events-none">
        {t('fill.vectorLabel')} {`{${fmt(xRaw)}, ${fmt(yRaw)}, ${fmt(zRaw)}}`}
      </div>
      <div className="absolute top-2 right-3 flex gap-2 text-xs font-mono pointer-events-none">
        <span className="text-red-400">X</span>
        <span className="text-green-400">Y</span>
        <span className="text-blue-400">Z</span>
      </div>
    </div>
  )
}
