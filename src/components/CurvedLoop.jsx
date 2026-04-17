import { useRef, useEffect, useState, useMemo, useId } from 'react';

function wrapOffset(value, period) {
  if (!Number.isFinite(period) || period <= 0) return value;
  let next = value;
  while (next <= -period) next += period;
  while (next > 0) next -= period;
  return next;
}

function parseOffset(value) {
  const parsed = Number.parseFloat(value || '0');
  return Number.isFinite(parsed) ? parsed : 0;
}

const CurvedLoop = ({
  marqueeText = '',
  text: legacyText,
  speed = 2,
  className,
  curveAmount = 400,
  direction = 'left',
  interactive = true
}) => {
  const sourceText = marqueeText || legacyText || 'Welcome to React Bits ✦';
  const text = useMemo(() => {
    const hasTrailing = /[\s\u00A0]$/.test(sourceText);
    return (hasTrailing ? sourceText.replace(/[\s\u00A0]+$/, '') : sourceText) + '\u00A0';
  }, [sourceText]);

  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const textPathRef = useRef(null);
  const [spacing, setSpacing] = useState(0);
  const offsetRef = useRef(0);
  const [layoutWidth, setLayoutWidth] = useState(1440);
  const uid = useId();
  const pathId = useMemo(() => `curve-${uid.replace(/[^a-zA-Z0-9_-]/g, '')}`, [uid]);
  const viewWidth = Math.max(380, Math.round(layoutWidth));
  const viewPadding = 0;
  const normalizedDirection = direction === 'right' ? 'right' : 'left';
  const normalizedSpeed = Number.isFinite(speed) ? Math.max(0, Math.abs(speed)) : 0;
  const normalizedCurve = useMemo(() => {
    const scaled = curveAmount * (viewWidth / 1440) * 0.28;
    return Math.max(-170, Math.min(170, scaled));
  }, [curveAmount, viewWidth]);
  const viewHeight = Math.max(230, Math.round(190 + Math.abs(normalizedCurve) * 0.45));
  const pathY = Math.max(84, Math.round(viewHeight * 0.43));
  const pathD = `M0,${pathY} Q${viewWidth / 2},${pathY + normalizedCurve} ${viewWidth},${pathY}`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(normalizedDirection);
  const velRef = useRef(0);

  useEffect(() => {
    dirRef.current = normalizedDirection;
  }, [normalizedDirection]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect?.width;
      if (!width) return;
      setLayoutWidth(width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const textLength = spacing;
  const period = Math.max(1, textLength);
  const pathLengthEstimate = viewWidth + Math.abs(normalizedCurve) * 1.85;
  const totalText = textLength
    ? Array(Math.ceil(pathLengthEstimate / textLength) + 3)
        .fill(text)
        .join('')
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    let canceled = false;
    const measure = () => {
      if (canceled || !measureRef.current) return;
      const width = measureRef.current.getComputedTextLength() ?? 0;
      if (width > 0) setSpacing(width);
    };
    const rafId = requestAnimationFrame(measure);
    const fontsPromise = typeof document !== 'undefined' && document.fonts ? document.fonts.ready : null;
    if (fontsPromise && typeof fontsPromise.then === 'function') {
      fontsPromise.then(() => measure());
    }
    return () => {
      canceled = true;
      cancelAnimationFrame(rafId);
    };
  }, [text, className, layoutWidth]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = 0;
      offsetRef.current = initial;
      textPathRef.current.setAttribute('startOffset', initial + 'px');
    }
  }, [spacing]);

  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === 'right' ? normalizedSpeed : -normalizedSpeed;
        const currentOffset = parseOffset(textPathRef.current.getAttribute('startOffset'));
        const newOffset = wrapOffset(currentOffset + delta, period);
        offsetRef.current = newOffset;
        textPathRef.current.setAttribute('startOffset', newOffset + 'px');
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [normalizedSpeed, period, ready, spacing]);

  const onPointerDown = (e) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = e.clientX;
    velRef.current = 0;
    if (e.target && typeof e.target.setPointerCapture === 'function') {
      e.target.setPointerCapture(e.pointerId);
    }
  };

  const onPointerMove = (e) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;
    const dx = e.clientX - lastXRef.current;
    lastXRef.current = e.clientX;
    velRef.current = dx;
    const currentOffset = parseOffset(textPathRef.current.getAttribute('startOffset'));
    const newOffset = wrapOffset(currentOffset + dx, period);
    offsetRef.current = newOffset;
    textPathRef.current.setAttribute('startOffset', newOffset + 'px');
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    if (velRef.current !== 0) {
      dirRef.current = velRef.current > 0 ? 'right' : 'left';
    }
  };

  const cursorStyle = interactive ? (dragRef.current ? 'grabbing' : 'grab') : 'auto';

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
      style={{ visibility: ready ? 'visible' : 'hidden', cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={endDrag}>
      <svg
        className="select-none w-full h-full overflow-visible block font-bold uppercase leading-none"
        viewBox={`${-viewPadding} 0 ${viewWidth + viewPadding * 2} ${viewHeight}`}
        preserveAspectRatio="xMidYMid meet">
        <text
          ref={measureRef}
          className={`font-bold uppercase leading-none ${className ?? ''}`}
          xmlSpace="preserve"
          style={{ visibility: 'hidden', opacity: 0, pointerEvents: 'none' }}>
          {text}
        </text>
        <defs>
          <path id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text xmlSpace="preserve" className={`fill-white ${className ?? ''}`}>
            <textPath
              ref={textPathRef}
              href={`#${pathId}`}
              xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
    </div>
  );
};

export default CurvedLoop;
