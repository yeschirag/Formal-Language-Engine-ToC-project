import { Handle, Position } from '@xyflow/react';

const STATE_COLORS = {
    start: {
        bg: 'linear-gradient(135deg, #5B9BD5 0%, #4A8BC2 100%)',
        border: '#2E6BA4',
        shadow: '0 4px 14px rgba(74, 139, 194, 0.35)',
    },
    accept: {
        bg: 'linear-gradient(135deg, #6BCB8B 0%, #4DB870 100%)',
        border: '#2E8B57',
        shadow: '0 4px 14px rgba(77, 184, 112, 0.35)',
    },
    startAccept: {
        bg: 'linear-gradient(135deg, #5BB8D5 0%, #3DA88B 100%)',
        border: '#2E7B7B',
        shadow: '0 4px 14px rgba(61, 168, 139, 0.35)',
    },
    dead: {
        bg: 'linear-gradient(135deg, #E07070 0%, #CC5555 100%)',
        border: '#B03030',
        shadow: '0 4px 14px rgba(204, 85, 85, 0.35)',
    },
    normal: {
        bg: 'linear-gradient(135deg, #8B9DC3 0%, #7189B0 100%)',
        border: '#5A6F8E',
        shadow: '0 4px 14px rgba(113, 137, 176, 0.25)',
    },
};

const handleStyle = {
    width: 8,
    height: 8,
    background: '#3a3a3a',
    border: '1.5px solid #555',
    borderRadius: '50%',
};

export default function StateNode({ data }) {
    const stateType = data.stateType || 'normal';
    const colors = STATE_COLORS[stateType] || STATE_COLORS.normal;
    const isStart = stateType === 'start' || stateType === 'startAccept';
    const isAccept = stateType === 'accept' || stateType === 'startAccept';

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {/* Start-state arrow indicator */}
            {isStart && (
                <div
                    style={{
                        position: 'absolute',
                        left: -32,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: 22,
                        color: colors.border,
                        lineHeight: 1,
                        pointerEvents: 'none',
                        userSelect: 'none',
                    }}
                    title="Start state"
                >
                    ▶
                </div>
            )}

            <div
                style={{
                    background: colors.bg,
                    border: `2.5px solid ${colors.border}`,
                    borderRadius: 8,
                    width: 100,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: colors.shadow,
                    cursor: 'grab',
                    position: 'relative',
                    // Accept states get a double border via outline
                    outline: isAccept ? `3px solid ${colors.border}` : 'none',
                    outlineOffset: isAccept ? 3 : 0,
                }}
            >
                <span
                    style={{
                        color: '#fff',
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "'Inter', -apple-system, sans-serif",
                        letterSpacing: 0.5,
                        textShadow: '0 1px 3px rgba(0,0,0,0.25)',
                        userSelect: 'none',
                    }}
                >
                    {data.label}
                </span>

                <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle, top: -5 }} />
                <Handle type="source" position={Position.Top} id="top-src" style={{ ...handleStyle, top: -5, left: '65%' }} />
                <Handle type="target" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -5 }} />
                <Handle type="source" position={Position.Bottom} id="bottom-src" style={{ ...handleStyle, bottom: -5, left: '65%' }} />
                <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -5 }} />
                <Handle type="source" position={Position.Left} id="left-src" style={{ ...handleStyle, left: -5, top: '65%' }} />
                <Handle type="target" position={Position.Right} id="right" style={{ ...handleStyle, right: -5 }} />
                <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -5, top: '65%' }} />
            </div>
        </div>
    );
}
