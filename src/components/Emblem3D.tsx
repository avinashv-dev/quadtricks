import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const BODY: [number, number][] = [
  [830, 118], [1027, 118], [1027, 636], [831, 636], [831, 367], [551, 634],
  [551, 690], [585, 724], [815, 724], [985, 906], [505, 906], [351, 750], [351, 575],
];
const TRI: [number, number][] = [[1021, 718], [1021, 906], [1218, 906]];

function toShape(pts: [number, number][]) {
  const s = new THREE.Shape();
  pts.forEach(([x, y], i) => {
    const px = (x - 785) / 100;
    const py = -(y - 512) / 100;
    if (i === 0) s.moveTo(px, py);
    else s.lineTo(px, py);
  });
  s.closePath();
  return s;
}

const extrude = { depth: 0.9, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.07, bevelSegments: 6 };

// Scroll keyframes: [x, y, z, rotX, rotY, scale] at each section stop
const KEYS = [
  [2.1, 0, -0.5, 0.1, -0.5, 0.66],
  [-2.6, 0, -1.5, 0.3, 0.9, 0.5],
  [2.6, 0.2, -1.5, -0.2, -1.2, 0.5],
  [0, 0, -3, 0.6, Math.PI * 2, 0.58],
  [-2.2, -0.2, -1, 0.1, Math.PI * 2.6, 0.5],
  [0, 0.2, 0, 0, Math.PI * 4, 0.58],
];

function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function sample(p: number) {
  const f = p * (KEYS.length - 1);
  const i = Math.min(KEYS.length - 2, Math.floor(f));
  const t = f - i;
  const e = t * t * (3 - 2 * t);
  return KEYS[i]!.map((v, k) => v + (KEYS[i + 1]![k]! - v) * e);
}

function Emblem() {
  const group = useRef<THREE.Group>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [body, tri] = useMemo(() => ([BODY, TRI] as const).map((pts) => {
    const g = new THREE.ExtrudeGeometry(toShape(pts), extrude);
    g.translate(0, 0, -0.45);
    return g;
  }) as [THREE.ExtrudeGeometry, THREE.ExtrudeGeometry], []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-2.2 * Math.min(delta, 0.05));
    const [x, y, z, rx, ry, s] = sample(scrollProgress()) as number[];
    const mx = isMobile ? 0 : x!;
    const sc = isMobile ? s! * 0.55 : s!;
    g.position.x += (mx - g.position.x) * k;
    g.position.y += (y! + (isMobile ? 1.6 : 0) - g.position.y) * k;
    g.position.z += (z! - g.position.z) * k;
    g.rotation.x += (rx! + state.pointer.y * -0.18 - g.rotation.x) * k;
    g.rotation.y += (ry! + state.pointer.x * 0.3 - g.rotation.y) * k;
    g.scale.setScalar(g.scale.x + (sc - g.scale.x) * k);
  });

  return (
    <group ref={group} scale={0.5}>
      <mesh geometry={body}>
        <meshPhysicalMaterial color="#e6eaf2" metalness={0.9} roughness={0.22} envMapIntensity={2.2} clearcoat={1} clearcoatRoughness={0.05} />
      </mesh>
      <mesh geometry={tri}>
        <meshPhysicalMaterial color="#ff3b2f" emissive="#ff2a1a" emissiveIntensity={1.4} metalness={0.3} roughness={0.2} clearcoat={1} />
      </mesh>
    </group>
  );
}

function Rings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, d) => {
    if (!ref.current) return;
    ref.current.rotation.z += Math.min(d, 0.05) * 0.08;
    ref.current.rotation.x = 1.2 + scrollProgress() * 1.5;
    ref.current.position.y = -scrollProgress() * 2;
  });
  return (
    <group ref={ref} position={[0, 0, -6]}>
      {[5, 7.5, 10].map((r, i) => (
        <mesh key={r} rotation={[0, 0, i * 0.6]}>
          <torusGeometry args={[r, 0.012, 8, 160]} />
          <meshBasicMaterial color={i === 1 ? "#ff3b2f" : "#8fa3c7"} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function Emblem3D() {
  const m = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas dpr={m ? [1, 1.25] : [1, 1.75]} performance={{ min: 0.5 }} camera={{ position: [0, 0, 9], fov: 42 }} gl={{ antialias: !m, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}>
      <color attach="background" args={["#05060a"]} />
      <fog attach="fog" args={["#05060a", 9, 22]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <directionalLight position={[-5, 2, 4]} intensity={1.2} color="#9fb6ff" />
      <pointLight position={[-4, -2, 3]} intensity={40} color="#ff3b2f" />
      <Float speed={1} rotationIntensity={0.12} floatIntensity={0.45}>
        <Emblem />
      </Float>
      <Rings />
      <Sparkles count={m ? 40 : 120} scale={[18, 12, 8]} size={2} speed={0.3} color="#c9d4ea" opacity={0.6} />
      <Environment resolution={m ? 64 : 256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -2]} scale={[12, 1, 1]} />
        <Lightformer form="rect" intensity={2} color="#ff5a3d" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[10, 0.6, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#9fb6ff" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[10, 0.6, 1]} />
        <Lightformer form="ring" intensity={2} position={[0, 0, -8]} scale={6} />
      </Environment>
      <EffectComposer>
        <Bloom resolutionScale={m ? 0.5 : 1} intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.2} mipmapBlur />
        <Vignette darkness={0.6} offset={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
