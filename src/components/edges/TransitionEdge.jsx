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
    // Use data flag for reliable self-loop detection (coordinates may differ
    // because source/target handles are offset on the same node)
    const isSelfLoop = data?.isSelfLoop ?? (sourceX === targetX && sourceY === targetY);

    let edgePath = '';
    let labelX = sourceX;
    let labelY = sourceY;

    if (isSelfLoop) {
        // Draw a clearly visible loop above the node
        const loopHeight = 55;
        const loopWidth = 28;
        const midX = (sourceX + targetX) / 2;
        const midY = Math.min(sourceY, targetY);

        const cp1X = midX - loopWidth;
        const cp1Y = midY - loopHeight;
        const cp2X = midX + loopWidth;
        const cp2Y = midY - loopHeight;

        edgePath = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
        labelX = midX;
        labelY = midY - loopHeight + 10;
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
        } catch {
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
                    stroke: 'hsl(var(--muted-foreground))',
                    strokeWidth: 1.5,
                    fill: 'none',
                    transition: 'stroke 0.2s',
                    ...style,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            {label && (
                <foreignObject
                    width={80}
                    height={30}
                    x={labelX - 40}
                    y={labelY - 15}
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
                                background: 'hsl(var(--card) / 0.8)',
                                backdropFilter: 'blur(4px)',
                                color: 'hsl(var(--foreground))',
                                border: '1px solid hsl(var(--border))',
                                fontSize: 11,
                                fontWeight: 600,
                                fontFamily: "'SF Mono', 'Fira Code', monospace",
                                padding: '4px 12px',
                                borderRadius: 14,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                letterSpacing: 0.5,
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
