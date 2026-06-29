import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import type { PointAttrs } from '../interpreter/evaluator'
import { useLang } from '../i18n/LanguageContext'

interface Props {
  points: PointAttrs[]
  height?: number
  // Draws a translucent unit sphere under the points — for exercises about
  // @N, so it's visually clear the points sit on a real surface (normals come
  // from that surface's geometry) rather than floating in empty space.
  showSurface?: boolean
}

export function PointCloudViewer({ points, height = 320, showSurface = false }: Props) {
  const { t } = useLang()
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    controls: OrbitControls
    geometry: THREE.BufferGeometry
    pointsMesh: THREE.Points
    surfaceMesh: THREE.Mesh | null
    surfaceWireframe: THREE.LineSegments | null
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

    // Ambient + directional light (also lights the optional surface mesh)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    scene.add(dirLight)

    // Optional translucent surface — shows the shape the points actually sit
    // on, so @N (surface normal) reads as "perpendicular to this shell" rather
    // than a mysterious property of disconnected dots. Built as a convex hull
    // of the real points (in the points-update effect below) rather than an
    // idealized sphere, so the wireframe's vertices are the actual points —
    // not a mismatched, independently-parameterized mesh floating nearby.
    let surfaceMesh: THREE.Mesh | null = null
    let surfaceWireframe: THREE.LineSegments | null = null
    if (showSurface) {
      const surfaceMat = new THREE.MeshStandardMaterial({
        color: 0x3b4555,
        transparent: true,
        opacity: 0.18,
        roughness: 0.8,
        metalness: 0,
        side: THREE.DoubleSide,
      })
      surfaceMesh = new THREE.Mesh(new THREE.BufferGeometry(), surfaceMat)
      scene.add(surfaceMesh)
      surfaceWireframe = new THREE.LineSegments(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({ color: 0x4a5568, transparent: true, opacity: 0.35 })
      )
      surfaceMesh.add(surfaceWireframe)
    }

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

    stateRef.current = { renderer, scene, camera, controls, geometry, pointsMesh, surfaceMesh, surfaceWireframe, animId }

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      controls.dispose()
      renderer.dispose()
      geometry.dispose()
      pointsMaterial.dispose()
      if (surfaceMesh) {
        surfaceMesh.geometry.dispose()
        ;(surfaceMesh.material as THREE.Material).dispose()
      }
      if (surfaceWireframe) {
        surfaceWireframe.geometry.dispose()
        ;(surfaceWireframe.material as THREE.Material).dispose()
      }
      el.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [height, showSurface])

  // Update geometry when points change
  useEffect(() => {
    const state = stateRef.current
    if (!state || points.length === 0) return

    const positions = new Float32Array(points.length * 3)
    const colors = new Float32Array(points.length * 3)
    const tmpColor = new THREE.Color()

    for (let i = 0; i < points.length; i++) {
      const p = points[i]
      positions[i * 3 + 0] = p.P.x
      positions[i * 3 + 1] = p.P.y
      positions[i * 3 + 2] = p.P.z
      // @Cd values are authored as the display color the player intends to see.
      // Three.js renders vertex colors in linear space and re-encodes to sRGB on
      // output, which would otherwise wash out the upper half of any gradient —
      // convert sRGB -> linear here so the round trip displays what was authored.
      tmpColor.setRGB(
        Math.min(Math.max(p.Cd.x, 0), 1),
        Math.min(Math.max(p.Cd.y, 0), 1),
        Math.min(Math.max(p.Cd.z, 0), 1),
      ).convertSRGBToLinear()
      colors[i * 3 + 0] = tmpColor.r
      colors[i * 3 + 1] = tmpColor.g
      colors[i * 3 + 2] = tmpColor.b
    }

    state.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    state.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    state.geometry.computeBoundingSphere()

    // Rebuild the optional surface as the convex hull of the CURRENT points,
    // so its vertices are the actual rendered points, not an independent
    // idealized sphere with its own unrelated vertex layout.
    if (state.surfaceMesh && points.length >= 4) {
      const hullPoints = points.map(p => new THREE.Vector3(p.P.x, p.P.y, p.P.z))
      const hullGeo = new ConvexGeometry(hullPoints)
      state.surfaceMesh.geometry.dispose()
      state.surfaceMesh.geometry = hullGeo
      if (state.surfaceWireframe) {
        state.surfaceWireframe.geometry.dispose()
        state.surfaceWireframe.geometry = new THREE.WireframeGeometry(hullGeo)
      }
    }
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
