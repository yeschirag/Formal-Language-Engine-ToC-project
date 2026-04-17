import DotField from './DotField';

export default function DotFieldBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      <DotField
        dotRadius={1}
        dotSpacing={10}
        bulgeStrength={0}
        glowRadius={0}
        sparkle
        waveAmplitude={0}
        cursorRadius={0}
        cursorForce={0.1}
        bulgeOnly
        trackViewport
        useCursorEventOnly
        disableInteraction
        gradientFrom="#A855F7"
        gradientTo="#B497CF"
        glowColor="#120F17"
      />
    </div>
  );
}
