import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

import logoLight from './logo.png';
import logoDark from './logo.dark.png';
import './Home.css';

function Home() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('calendar');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [recordedEntries, setRecordedEntries] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);

    const [formData, setFormData] = useState({ assignmentId: '', hours: '0', minutes: '0', description: '' });

    const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
    const [newAssignmentName, setNewAssignmentName] = useState('');
    const [newAssignmentType, setNewAssignmentType] = useState('WORK');

    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [exportType, setExportType] = useState('all');
    const [exportStart, setExportStart] = useState('');
    const [exportEnd, setExportEnd] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const fetchMonthData = async () => {
        try {
            const res = await api.get(`/attendance/${year}/${month}`);
            if (typeof res.data === 'object') setRecordedEntries(res.data);
        } catch (err) {
            console.error(t('data_load_error'), err);
        }
    };

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) {
            navigate('/login');
            return;
        }

        const checkRole = async () => {
            try {
                const res = await api.get('/auth/me');
                if (res.data.role === 'ADMIN') {
                    setIsAdmin(true);
                }
            } catch (e) {
                console.error(t('role_fetch_error'));
            }
        };
        checkRole();
    }, [navigate, t]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) return;

        api.get('/auth/assignments')
            .then(res => { if (Array.isArray(res.data)) setAssignments(res.data); })
            .catch(err => console.error(t('category_load_error'), err));
        fetchMonthData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDate, t]);

    const getEntryColor = (type) => {
        switch (type) {
            case 'WORK': return '#4299e1';
            case 'VACATION': return '#ecc94b';
            case 'HOLIDAY': return '#f56565';
            default: return '#718096';
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const mins = (parseInt(formData.hours || 0) * 60) + parseInt(formData.minutes || 0);
        if (mins <= 0) return alert(t('enter_time_gt_0'));

        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        try {
            await api.post('/attendance/entry', {
                date: dateStr, assignmentId: formData.assignmentId, workedMinutes: mins, description: formData.description
            });
            setFormData({ assignmentId: '', hours: '0', minutes: '0', description: '' });
            fetchMonthData();
        } catch (err) { console.error(err); alert(t('save_error')); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('delete') + "?")) return;
        try {
            await api.delete(`/attendance/entry/${id}`);
            fetchMonthData();
        } catch (err) { console.error(err); alert(t('delete_error')); }
    };

    const handleExport = async () => {
        try {
            let url = '/export/me';
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
            link.setAttribute('download', exportType === 'range' ? `my_activities_${exportStart}_${exportEnd}.csv` : 'my_activities_all.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();

            setExportModalOpen(false);
        } catch (err) {
            console.error(err);
            alert(t('download_error'));
        }
    };

    const handleCreateAssignment = async () => {
        if (!newAssignmentName.trim()) return alert(t('enter_name'));
        try {
            const res = await api.post('/auth/assignments', { name: newAssignmentName, type: newAssignmentType });
            setAssignments([...assignments, res.data]);
            setFormData({ ...formData, assignmentId: res.data.id });
            setShowNewAssignmentForm(false);
            setNewAssignmentName('');
        } catch (err) { console.error(err); alert(t('create_activity_error')); }
    };

    const monthName = currentDate.toLocaleString(i18n.language, { month: 'long' });
    const selectedDayEntries = Array.isArray(recordedEntries[selectedDay]) ? recordedEntries[selectedDay] : [];

    return (
        <>
            <div className="dashboard-container">
                <nav className="top-bar">
                    <div className="logo-wrapper">
                        <img src={logoLight} alt="Logo" className="logo-img light-logo" />
                        <img src={logoDark} alt="Logo" className="logo-img dark-logo" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {isAdmin && (
                            <button onClick={() => navigate('/admin')} style={{ background: '#e53e3e', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                                ⚙️ {t('admin_panel')}
                            </button>
                        )}
                        <button onClick={() => setExportModalOpen(true)} style={{ padding: '8px 15px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                            📥 {t('download_csv')}
                        </button>
                        <span onClick={() => navigate('/profile')} style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: 'bold' }}>👤 {localStorage.getItem('email')}</span>
                        <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ padding: '8px 15px', background: '#fc8181', color: 'white', border: 'none', borderRadius: '20px' }}>{t('logout')}</button>
                    </div>
                </nav>

                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0', background: 'var(--card-bg)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => setViewMode('calendar')} style={{ padding: '10px 20px', background: viewMode === 'calendar' ? 'var(--primary)' : 'var(--bg-color)', color: viewMode === 'calendar' ? '#fff' : 'var(--text-color)', border: 'none' }}>{t('calendar_view')}</button>
                        <button onClick={() => setViewMode('planner')} style={{ padding: '10px 20px', background: viewMode === 'planner' ? 'var(--primary)' : 'var(--bg-color)', color: viewMode === 'planner' ? '#fff' : 'var(--text-color)', border: 'none' }}>{t('planner_view')}</button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => setCurrentDate(new Date(year, month - 2, 1))} style={{border: 'none', background: 'var(--bg-color)', padding: '10px 15px', color: 'var(--text-color)'}}>←</button>
                        <h2 style={{ margin: 0 }}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)} {year}</h2>
                        <button onClick={() => setCurrentDate(new Date(year, month, 1))} style={{border: 'none', background: 'var(--bg-color)', padding: '10px 15px', color: 'var(--text-color)'}}>→</button>
                    </div>
                </header>

                {viewMode === 'calendar' ? (
                    <div className="calendar-grid">
                        {days.map(day => {
                            const dayEntries = Array.isArray(recordedEntries[day]) ? recordedEntries[day] : [];
                            const totalMins = dayEntries.reduce((sum, curr) => sum + curr.workedMinutes, 0);
                            return (
                                <div key={day} className="day-card" onClick={() => { setSelectedDay(day); setIsModalOpen(true); }}>
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}><strong>{day}</strong><span style={{color:'var(--primary)'}}>+</span></div>
                                    {totalMins > 0 && <div style={{ marginTop: '15px', background: 'var(--primary)', color: 'white', padding: '5px', borderRadius: '10px', textAlign: 'center', fontSize: '0.8rem' }}>{Math.floor(totalMins / 60)}{t('h')} {totalMins % 60}{t('m')}</div>}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {days.map(day => {
                            const dayEntries = Array.isArray(recordedEntries[day]) ? recordedEntries[day] : [];
                            if (dayEntries.length === 0) return null;
                            return (
                                <div key={day} style={{ background: 'var(--card-bg)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                                    <h3 style={{ margin: '0 0 10px' }}>{day} {monthName}</h3>
                                    {dayEntries.map(entry => (
                                        <div key={entry.id} className="planner-item" style={{ borderLeft: `5px solid ${getEntryColor(entry.type)}` }}>
                                            <div><strong>{entry.assignmentName}</strong><br/><small>{entry.description}</small></div>
                                            <div>{Math.floor(entry.workedMinutes / 60)}{t('h')} {entry.workedMinutes % 60}{t('m')} <button onClick={() => handleDelete(entry.id)}>✖</button></div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div style={{ background: 'var(--modal-bg)', padding: '30px', borderRadius: '25px', width: '400px', border: '1px solid var(--border-color)' }}>
                        <h3>{selectedDay} {monthName}</h3>
                        {selectedDayEntries.map(entry => (
                            <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-color)', marginBottom: '5px', borderRadius: '10px' }}>
                                <span>{entry.assignmentName}</span>
                                <button onClick={() => handleDelete(entry.id)} style={{color:'red'}}>✖</button>
                            </div>
                        ))}
                        <hr/>
                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {!showNewAssignmentForm ? (
                                <div style={{display:'flex', gap:'5px'}}>
                                    <select value={formData.assignmentId} onChange={e => setFormData({...formData, assignmentId: e.target.value})} style={{flex:1}}>
                                        <option value="">{t('select_type')}</option>
                                        {assignments.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                    <button type="button" onClick={() => setShowNewAssignmentForm(true)}>{t('new_type')}</button>
                                </div>
                            ) : (
                                <div style={{background: 'var(--bg-color)', padding: '10px', borderRadius: '10px'}}>
                                    <input placeholder={t('name_placeholder')} onChange={e => setNewAssignmentName(e.target.value)} />
                                    <select onChange={e => setNewAssignmentType(e.target.value)} style={{marginTop: '10px'}}>
                                        <option value="WORK">{t('work')}</option><option value="VACATION">{t('vacation')}</option><option value="HOLIDAY">{t('holiday')}</option>
                                    </select>
                                    <button type="button" onClick={handleCreateAssignment} style={{marginTop: '10px', width: '100%'}}>{t('save')}</button>
                                </div>
                            )}
                            <input placeholder={t('description')} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <div style={{display:'flex', gap:'5px'}}>
                                <input type="number" placeholder={t('hours')} onChange={e => setFormData({...formData, hours: e.target.value})} />
                                <input type="number" placeholder={t('minutes')} onChange={e => setFormData({...formData, minutes: e.target.value})} />
                            </div>
                            <button type="submit">{t('save')}</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>{t('cancel')}</button>
                        </form>
                    </div>
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
        </>
    );
}

export default Home;