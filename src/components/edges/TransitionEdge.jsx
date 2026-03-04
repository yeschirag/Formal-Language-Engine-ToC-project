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
    const isSelfLoop = sourceX === targetX && sourceY === targetY;

    let edgePath = '';
    let labelX = sourceX;
    let labelY = sourceY;

    if (isSelfLoop) {
        const offset = 80; // How far out the loop extends
        const spread = 50; // How wide the loop is at its peak
        let cp1X, cp1Y, cp2X, cp2Y;

        switch (sourcePosition) {
            case 'bottom':
                cp1X = sourceX - spread; cp1Y = sourceY + offset;
                cp2X = targetX + spread; cp2Y = targetY + offset;
                labelX = sourceX; labelY = sourceY + offset - 15;
                break;
            case 'left':
                cp1X = sourceX - offset; cp1Y = sourceY - spread;
                cp2X = targetX - offset; cp2Y = targetY + spread;
                labelX = sourceX - offset + 15; labelY = sourceY;
                break;
            case 'right':
                cp1X = sourceX + offset; cp1Y = sourceY - spread;
                cp2X = targetX + offset; cp2Y = targetY + spread;
                labelX = sourceX + offset - 15; labelY = sourceY;
                break;
            case 'top':
            default:
                cp1X = sourceX - spread; cp1Y = sourceY - offset;
                // Important: use targetX/targetY for cp2 to anchor properly
                cp2X = targetX + spread; cp2Y = targetY - offset;
                labelX = sourceX; labelY = sourceY - offset + 15;
                break;
        }

        edgePath = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;
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
