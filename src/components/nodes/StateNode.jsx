import { Handle, Position } from '@xyflow/react';

const STATE_COLORS = {
    start: {
        bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        border: '#60a5fa',
        shadow: '0 8px 30px rgba(59, 130, 246, 0.4)',
        text: '#ffffff',
    },
    accept: {
        bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        border: '#34d399',
        shadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
        text: '#ffffff',
    },
    startAccept: {
        bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        border: '#67e8f9',
        shadow: '0 8px 30px rgba(6, 182, 212, 0.4)',
        text: '#ffffff',
    },
    dead: {
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        border: '#f87171',
        shadow: '0 8px 30px rgba(239, 68, 68, 0.4)',
        text: '#ffffff',
    },
    normal: {
        bg: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        border: '#94a3b8',
        shadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
        text: '#ffffff',
    },
};

const handleStyle = {
    width: 6,
    height: 6,
    background: 'hsl(var(--muted-foreground))',
    border: 'none',
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
                        filter: `drop-shadow(0 0 8px ${colors.border})`
                    }}
                    title="Start state"
                >
                    ▶
                </div>
            )}

            <div
                style={{
                    background: colors.bg,
                    backdropFilter: 'blur(8px)',
                    border: `2px solid ${colors.border}`,
                    borderRadius: 12,
                    width: 76,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: colors.shadow,
                    cursor: 'grab',
                    position: 'relative',
                    // Accept states get a double border via outline
                    outline: isAccept ? `2px solid ${colors.border}` : 'none',
                    outlineOffset: isAccept ? 3 : 0,
                    transition: 'all 0.2s ease',
                }}
            >
                <span
                    style={{
                        color: colors.text,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'SF Mono', 'Fira Code', monospace",
                        letterSpacing: 0.5,
                        userSelect: 'none',
                    }}
                >
                    {data.label}
                </span>

                <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle, top: -3 }} />
                <Handle type="source" position={Position.Top} id="top-src" style={{ ...handleStyle, top: -3, left: '60%' }} />
                <Handle type="target" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -3 }} />
                <Handle type="source" position={Position.Bottom} id="bottom-src" style={{ ...handleStyle, bottom: -3, left: '60%' }} />
                <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -3 }} />
                <Handle type="source" position={Position.Left} id="left-src" style={{ ...handleStyle, left: -3, top: '60%' }} />
                <Handle type="target" position={Position.Right} id="right" style={{ ...handleStyle, right: -3 }} />
                <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -3, top: '60%' }} />
            </div>
        </div>
    );
}
