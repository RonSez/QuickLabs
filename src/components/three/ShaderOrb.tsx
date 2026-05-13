"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Soft animated gradient orb. Cheaper variant: 2 simplex octaves, no per-pixel
// grain. Reacts to mouse via uMouse uniform.
const fragmentShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2 uMouse;       // -1..1
  uniform float uAspect;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;

  // 2D simplex noise (Ashima)
  vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
            + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x  = 2.0 * fract(p * C.www) - 1.0;
    vec3 h  = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main(){
    vec2 uv = vUv - 0.5;
    uv.x *= uAspect;

    vec2 m = uMouse * 0.18;
    uv -= m;

    float t = uTime * 0.07;

    // 2 octaves only
    float n1 = snoise(uv * 1.6 + vec2(t, -t));
    float n2 = snoise(uv * 3.2 + vec2(-t * 1.2, t) + n1 * 0.4);
    float n  = n1 * 0.7 + n2 * 0.3;

    float d = length(uv);
    float orb = smoothstep(0.95, 0.0, d - n * 0.18);

    float mixA = clamp(n * 0.5 + 0.5, 0.0, 1.0);
    float mixB = clamp(d * 1.4 - 0.1, 0.0, 1.0);
    vec3 col = mix(uColorA, uColorB, mixA);
    col = mix(col, uColorC, mixB);

    float core = smoothstep(0.4, 0.0, d) * 0.55;
    col += uColorB * core;

    col *= orb;

    gl_FragColor = vec4(col, orb);
  }
`;

export function ShaderOrb() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouseTarget = useRef(new THREE.Vector2(0, 0));
  const mouse = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
      uColorA: { value: new THREE.Color("#2d8bff") },
      uColorB: { value: new THREE.Color("#7cb6ff") },
      uColorC: { value: new THREE.Color("#0a1638") },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    const u = matRef.current.uniforms;
    u.uTime.value += delta;
    u.uAspect.value = state.size.width / state.size.height;

    mouseTarget.current.set(state.pointer.x, state.pointer.y);
    mouse.current.lerp(mouseTarget.current, 0.05);
    u.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
