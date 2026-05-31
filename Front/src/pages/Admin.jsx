import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import './Home.css';

function Admin() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('all');
    const [exportStart, setExportStart] = useState('');
    const [exportEnd, setExportEnd] = useState('');

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const res = await api.get('/admin/users');
                setUsers(res.data);
            } catch (err) {
                alert(t('no_admin_rights'));
                navigate('/home');
            }
        };
        checkAccess();
    }, [navigate, t]);

    const handleExport = async () => {
        try {
            let url = '/export/all';
            const params = new URLSearchParams();
            if (exportType === 'range') {
                if (!exportStart || !exportEnd) return alert(t('select_dates'));
                params.append('startDate', exportStart);
                params.append('endDate', exportEnd);
            }

            const res = await api.get(`${url}?${params.toString()}`, { responseType: 'blob' });

            const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', exportType === 'range' ? `all_activities_${exportStart}_${exportEnd}.csv` : 'all_activities.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();

            setExportModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(t('download_error'));
        }
    };

    return (
        <>
            <div className="dashboard-container">
                <nav className="top-bar">
                    <strong style={{ fontSize: '1.2rem', color: 'var(--text-color)' }}>⚙️ {t('admin_panel')}</strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => setExportModalOpen(true)} style={{ padding: '8px 15px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '20px' }}>
                            📥 {t('download_db_csv')}
                        </button>
                        <button onClick={() => navigate('/home')} style={{ padding: '8px 15px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                            ← {t('back')}
                        </button>
                    </div>
                </nav>

                <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--bg-color)' }}>
                            <th style={{ padding: '15px', color: 'var(--text-color)' }}>ID</th>
                            <th style={{ color: 'var(--text-color)' }}>Email</th>
                            <th style={{ color: 'var(--text-color)' }}>{t('role')}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr
                                key={u.id}
                                style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer', transition: 'background 0.2s' }}
                                onClick={() => navigate(`/admin/user/${u.id}`)}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-color)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '15px', color: 'var(--text-color)' }}>{u.id}</td>
                                <td style={{ color: 'var(--text-color)' }}>{u.email}</td>
                                <td>
                                    <span style={{
                                        padding: '5px 10px',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        background: u.rule === 'ADMIN' ? 'rgba(245, 101, 101, 0.2)' : 'rgba(72, 187, 120, 0.2)',
                                        color: u.rule === 'ADMIN' ? '#f56565' : '#48bb78',
                                        fontWeight: 'bold'
                                    }}>
                                        {u.rule}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {exportModalOpen && (
                <div className="modal-overlay" style={{ zIndex: 1200 }}>
                    <div style={{ background: 'var(--modal-bg)', padding: '30px', borderRadius: '25px', width: '350px', border: '1px solid var(--border-color)', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--text-color)' }}>📥 {t('download_db_csv')}</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <select value={exportType} onChange={e => setExportType(e.target.value)} style={{ padding: '12px', width: '100%', boxSizing: 'border-box' }}>
                                <option value="all">{t('all_time')}</option>
                                <option value="range">{t('specific_period')}</option>
                            </select>

                            {exportType === 'range' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-color)', padding: '15px', borderRadius: '15px' }}>
                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 'bold' }}>{t('from_date')}</label>
                                    <input type="date" value={exportStart} onChange={e => setExportStart(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }} />

                                    <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: 'bold' }}>{t('to_date')}</label>
                                    <input type="date" value={exportEnd} onChange={e => setExportEnd(e.target.value)} style={{ width: '100%', boxSizing: 'border-box' }} />
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="button" onClick={() => setExportModalOpen(false)} style={{ flex: 1, padding: '12px', background: 'var(--bg-color)', color: 'var(--text-color)', border: 'none' }}>{t('cancel')}</button>
                                <button type="button" onClick={handleExport} style={{ flex: 2, padding: '12px', background: '#48bb78', color: 'white', border: 'none' }}>{t('download')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Admin;