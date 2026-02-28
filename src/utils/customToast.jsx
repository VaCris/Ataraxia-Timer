import React from 'react';
import toast from 'react-hot-toast';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

export const showToast = ({
    title,
    message,
    type = 'error',
    fields = [],
    regexErrors = [],
    details = null
}) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    toast.custom((t) => (
        <div
            style={{
                background: 'rgba(20, 20, 20, 0.95)',
                backdropFilter: 'blur(10px)',
                borderLeft: `4px solid ${getBorderColor(type)}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                pointerEvents: 'auto',
                opacity: t.visible ? 1 : 0,
                transform: t.visible ? 'translateY(0)' : 'translateY(-20px)',
                width: isMobile ? '90vw' : '400px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getIcon(type)}
                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'white', fontWeight: '600' }}>
                        {title}
                    </h4>
                </div>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
                >
                    <X size={16} />
                </button>
            </div>

            {message && (
                <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#9ca3af' }}>
                    {message}
                </p>
            )}

            {fields.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>Campos faltantes:</span>
                    <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {fields.map((field, idx) => (
                            <li key={idx} style={{ fontSize: '0.85rem', color: '#9ca3af' }}>• {field}</li>
                        ))}
                    </ul>
                </div>
            )}

            {regexErrors.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'white' }}>Requisitos no cumplidos:</span>
                    <ul style={{ margin: '4px 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {regexErrors.map((rule, idx) => (
                            <li key={idx} style={{ fontSize: '0.85rem', color: '#fca5a5' }}>✗ {rule}</li>
                        ))}
                    </ul>
                </div>
            )}

            {details && (
                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#9ca3af' }}>Detalles técnicos:</span>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#d1d5db', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                        {details}
                    </p>
                </div>
            )}
        </div>
    ), {
        duration: (fields.length > 0 || regexErrors.length > 0) ? 6000 : 4000,
        position: isMobile ? 'bottom-center' : 'top-right'
    });
};

const getBorderColor = (type) => {
    switch (type) {
        case 'success': return '#34d399';
        case 'error': return '#ef4444';
        case 'warning': return '#fbbf24';
        default: return '#8b5cf6';
    }
};

const getIcon = (type) => {
    switch (type) {
        case 'success': return <CheckCircle size={20} color="#34d399" />;
        case 'error': return <XCircle size={20} color="#ef4444" />;
        case 'warning': return <AlertCircle size={20} color="#fbbf24" />;
        default: return <Info size={20} color="#8b5cf6" />;
    }
};