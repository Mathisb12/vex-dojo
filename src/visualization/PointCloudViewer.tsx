import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { PointAttrs } from '../interpreter/evaluator'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  points: PointAttrs[]
  height?: number
}

export function PointCloudViewer({ points, height = 320 }: Props) {
  const { t } = useLang()
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    geometry: THREE.BufferGeometry
    pointsMesh: THREE.Points
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

    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / height, 0.01, 100)
    camera.position.set(0, 0, 3)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 0.5
    controls.maxDistance = 20

    // Grid helper — sits at y=0, the true world origin
    const grid = new THREE.GridHelper(4, 10, 0x30363d, 0x1e2530)
    scene.add(grid)

    // Axes
    const axes = new THREE.AxesHelper(0.4)
    scene.add(axes)

    // Points
    const geometry = new THREE.BufferGeometry()
    const pointsMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      sizeAttenuation: true,
    })
    const pointsMesh = new THREE.Points(geometry, pointsMaterial)
    scene.add(pointsMesh)

    // Ambient + directional light (for future mesh mode)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    let animId = 0
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!el) return
      const w = el.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(el)

    stateRef.current = { renderer, scene, camera, controls, geometry, pointsMesh, animId }

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      geometry.dispose()
      pointsMaterial.dispose()
      el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [height])

  // Update geometry when points change
  useEffect(() => {
    const state = stateRef.current
    if (!state || points.length === 0) return

    const positions = new Float32Array(points.length * 3)
    const colors = new Float32Array(points.length * 3)

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      positions[i * 3 + 0] = p.P.x
      positions[i * 3 + 1] = p.P.y
      positions[i * 3 + 2] = p.P.z
      colors[i * 3 + 0] = Math.min(Math.max(p.Cd.x, 0), 1)
      colors[i * 3 + 1] = Math.min(Math.max(p.Cd.y, 0), 1)
      colors[i * 3 + 2] = Math.min(Math.max(p.Cd.z, 0), 1)
    }

    state.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    state.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    state.geometry.computeBoundingSphere()
  }, [points])

  return (
    <div className="relative rounded-lg overflow-hidden border border-vex-border bg-vex-bg">
      <div ref={mountRef} style={{ width: '100%', height }} />
      <div className="absolute bottom-2 left-3 text-vex-muted text-xs font-mono pointer-events-none">
        {points.length} pts · {t('viewer.controls')}
      </div>
      <div className="absolute top-2 right-3 flex gap-2 text-xs font-mono pointer-events-none">
        <span className="text-red-400">X</span>
        <span className="text-green-400">Y</span>
        <span className="text-blue-400">Z</span>
      </div>
    </div>
  )
}
