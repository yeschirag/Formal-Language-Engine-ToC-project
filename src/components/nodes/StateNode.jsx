import { Handle, Position } from '@xyflow/react';

const STATE_COLORS = {
    start: {
        bg: 'linear-gradient(165deg, hsl(217 90% 58%) 0%, hsl(227 84% 49%) 100%)',
        border: 'hsl(215 96% 74%)',
        glow: 'rgba(37, 99, 235, 0.36)',
        text: '#f8fbff',
    },
    accept: {
        bg: 'linear-gradient(165deg, hsl(161 77% 43%) 0%, hsl(171 84% 34%) 100%)',
        border: 'hsl(162 72% 69%)',
        glow: 'rgba(16, 185, 129, 0.34)',
        text: '#f8fffd',
    },
    startAccept: {
        bg: 'linear-gradient(165deg, hsl(197 95% 55%) 0%, hsl(220 88% 55%) 100%)',
        border: 'hsl(192 100% 82%)',
        glow: 'rgba(8, 145, 178, 0.35)',
        text: '#f7fdff',
    },
    dead: {
        bg: 'linear-gradient(165deg, hsl(0 82% 62%) 0%, hsl(8 86% 54%) 100%)',
        border: 'hsl(2 97% 79%)',
        glow: 'rgba(239, 68, 68, 0.35)',
        text: '#fff8f8',
    },
    normal: {
        bg: 'linear-gradient(165deg, hsl(var(--card)) 0%, hsl(var(--secondary) / 0.95) 100%)',
        border: 'hsl(var(--border))',
        glow: 'rgba(15, 23, 42, 0.2)',
        text: 'hsl(var(--foreground))',
    },
};

const handleStyle = {
    width: 8,
    height: 8,
    background: 'hsl(var(--card))',
    border: '1.5px solid hsl(var(--muted-foreground) / 0.5)',
    borderRadius: '50%',
};

export default function StateNode({ data }) {
    const stateType = data.stateType || 'normal';
    const colors = STATE_COLORS[stateType] || STATE_COLORS.normal;
    const isStart = stateType === 'start' || stateType === 'startAccept';
    const isAccept = stateType === 'accept' || stateType === 'startAccept';

    return (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            {isStart && (
                <div
                    style={{
                        position: 'absolute',
                        left: -28,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 0,
                        height: 0,
                        borderTop: '8px solid transparent',
                        borderBottom: '8px solid transparent',
                        borderLeft: `14px solid ${colors.border}`,
                        filter: `drop-shadow(0 0 10px ${colors.glow})`,
                        pointerEvents: 'none',
                    }}
                    title="Start state"
                />
            )}

            <div
                style={{
                    background: colors.bg,
                    border: `2px solid ${colors.border}`,
                    borderRadius: '50%',
                    width: 82,
                    height: 82,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 14px 30px ${colors.glow}`,
                    cursor: 'grab',
                    position: 'relative',
                    outline: isAccept ? `2px solid ${colors.border}` : 'none',
                    outlineOffset: isAccept ? 5 : 0,
                    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                }}
            >
                <span
                    title={data.label}
                    style={{
                        color: colors.text,
                        fontSize: data.label?.length > 8 ? 11 : 14,
                        fontWeight: 700,
                        fontFamily: "'Inter', 'SF Mono', 'Fira Code', monospace",
                        letterSpacing: 0.4,
                        userSelect: 'none',
                        textAlign: 'center',
                        wordBreak: 'break-word',
                        whiteSpace: 'normal',
                        maxWidth: '70px',
                        lineHeight: 1.2,
                        padding: '2px 4px',
                    }}
                >
                    {data.label}
                </span>

                <Handle type="target" position={Position.Top} id="top" style={{ ...handleStyle, top: -4 }} />
                <Handle type="source" position={Position.Top} id="top-src" style={{ ...handleStyle, top: -4, left: '60%' }} />
                <Handle type="target" position={Position.Bottom} id="bottom" style={{ ...handleStyle, bottom: -4 }} />
                <Handle type="source" position={Position.Bottom} id="bottom-src" style={{ ...handleStyle, bottom: -4, left: '60%' }} />
                <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -4 }} />
                <Handle type="source" position={Position.Left} id="left-src" style={{ ...handleStyle, left: -4, top: '60%' }} />
                <Handle type="target" position={Position.Right} id="right" style={{ ...handleStyle, right: -4 }} />
                <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -4, top: '60%' }} />
            </div>

            {isAccept && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 8,
                        borderRadius: '50%',
                        border: `1.6px solid ${colors.border}`,
                        pointerEvents: 'none',
                    }}
                />
            )}
        </div>
    );
}
