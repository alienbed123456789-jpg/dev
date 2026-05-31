import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';
import './Home.css';

function UserActivities() {
    const { t } = useTranslation();
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('all');
    const [exportStart, setExportStart] = useState('');
    const [exportEnd, setExportEnd] = useState('');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const res = await api.get(`/admin/users/${userId}/activities`);
                setActivities(res.data);
            } catch (err) {
                alert(t('activities_load_error'));
            } finally {
                setLoading(false);
            }
        };
        fetchActivities();
    }, [userId, t]);

    const handleExport = async () => {
        try {
            let url = `/export/user/${userId}`;
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
            link.setAttribute('download', exportType === 'range' ? `user_${userId}_${exportStart}_${exportEnd}.csv` : `user_${userId}_all.csv`);
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
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate('/admin')} style={{ padding: '8px 15px', background: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>← {t('back_to_list')}</button>
                <button onClick={() => setExportModalOpen(true)} style={{ padding: '8px 15px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '20px' }}>📥 {t('download_csv')}</button>
            </div>

            <h2>{t('user_activities')} (ID: {userId})</h2>

            {loading ? <p>{t('loading')}</p> : (
                <div style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '20px' }}>
                    {activities.length === 0 ? <p>{t('no_activities')}</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '10px' }}>{t('date')}</th>
                                <th>{t('activity')}</th>
                                <th>{t('duration')}</th>
                                <th>{t('description')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {activities.map(act => (
                                <tr key={act.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '10px' }}>{act.date}</td>
                                    <td>{act.assignment.name}</td>
                                    <td>
                                        {Math.floor(act.workedMinutes / 60)}{t('h')} {act.workedMinutes % 60}{t('m')}
                                    </td>
                                    <td>{act.description}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {exportModalOpen && (
                <div className="modal-overlay" style={{ zIndex: 1200 }}>
                    <div style={{ background: 'var(--modal-bg)', padding: '30px', borderRadius: '25px', width: '350px', border: '1px solid var(--border-color)', boxShadow: '0 15px 40px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--text-color)' }}>📥 {t('download_csv')}</h3>

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
        </div>
    );
}

export default UserActivities;