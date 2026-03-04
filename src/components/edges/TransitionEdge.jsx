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
                    stroke: '#999',
                    strokeWidth: 1.8,
                    fill: 'none',
                    ...style,
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            {label && (
                <foreignObject
                    width={60}
                    height={30}
                    x={labelX - 30}
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
                                background: '#a0a0a0',
                                color: '#fff',
                                fontSize: 11,
                                fontWeight: 700,
                                fontFamily: "'Inter', monospace",
                                padding: '3px 10px',
                                borderRadius: 14,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
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
