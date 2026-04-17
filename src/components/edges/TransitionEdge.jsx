import { getBezierPath } from '@xyflow/react';

export default function TransitionEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    markerEnd,
    style = {},
}) {
    const isSelfLoop = data?.isSelfLoop ?? (sourceX === targetX && sourceY === targetY);

    let edgePath = '';
    let labelX = sourceX;
    let labelY = sourceY;

    if (isSelfLoop) {
        // Build a taller, balanced loop so the edge reads clearly above the node.
        const gap = Math.max(10, Math.abs(targetX - sourceX));
        const lift = 74;
        const controlSpread = 58 + gap * 1.1;
        const midX = (sourceX + targetX) / 2;
        const topY = Math.min(sourceY, targetY) - lift;

        const cp1X = sourceX + controlSpread;
        const cp1Y = sourceY - 20;
        const cp2X = targetX - controlSpread;
        const cp2Y = targetY - 20;

        edgePath = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
        labelX = midX + 10;
        labelY = topY + 10;
    } else {
        try {
            const res = getBezierPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            });
            edgePath = res[0];
            labelX = res[1];
            labelY = res[2];
        } catch (e) {
            edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
            labelX = (sourceX + targetX) / 2;
            labelY = (sourceY + targetY) / 2;
        }
    }

    const label = data?.label || '';

    return (
        <>
            <path
                id={id}
                style={{
                    stroke: 'hsl(var(--foreground) / 0.58)',
                    strokeWidth: 2,
                    fill: 'none',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    transition: 'stroke 0.2s, stroke-width 0.2s',
                    ...style,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            {label && (
                <foreignObject
                    width={108}
                    height={34}
                    x={labelX - 54}
                    y={labelY - 17}
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                    style={{ overflow: 'visible', pointerEvents: 'none' }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none',
                        }}
                    >
                        <span
                            style={{
                                background: 'linear-gradient(180deg, hsl(var(--card) / 0.98), hsl(var(--secondary) / 0.95))',
                                color: 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border) / 0.95)',
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: "'Inter', 'SF Mono', monospace",
                                padding: '5px 12px',
                                borderRadius: 999,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
                                letterSpacing: 0.3,
                            }}
                        >
                            {label}
                        </span>
                    </div>
                </foreignObject>
            )}
        </>
    );
}
