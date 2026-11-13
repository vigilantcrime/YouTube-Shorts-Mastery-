import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame} from 'remotion';
export const GlTest = () => {
  const fr = useCurrentFrame();
  return (
    <ThreeCanvas width={540} height={960} camera={{position: [0, 1.5, 5], fov: 50}} style={{background: '#20102a'}}>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={40} color="#ff5c9e" />
      <mesh rotation={[0.4, fr * 0.05, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshStandardMaterial color="#6be0ff" /></mesh>
    </ThreeCanvas>
  );
};
