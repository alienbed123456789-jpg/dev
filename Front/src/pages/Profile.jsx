import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

function Profile() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const email = localStorage.getItem('email');

    const toggleTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const handleRequestCode = async () => {
        try {
            await api.post('/auth/request-password-change');
            alert(t('code_sent'));
            setStep(2);
        } catch (err) {
            alert(err.response?.data || t('code_request_error'));
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/change-password', { code, newPassword });
            alert(t('save') + " OK! " + t('password_changed'));
            setStep(1); setCode(''); setNewPassword('');
        } catch (err) {
            alert(err.response?.data || t('password_change_error'));
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', background: 'var(--card-bg)', marginTop: '50px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <button onClick={() => navigate('/home')} style={{ marginBottom: '20px', background: 'var(--border-color)', color: 'var(--text-color)', padding: '8px 15px', border: 'none' }}>← {t('back')}</button>
            <h2 style={{marginTop: 0}}>{t('settings')}</h2>
            <p style={{color: 'var(--primary)', fontWeight: 'bold'}}>{email}</p>

            <div style={{ marginBottom: '30px', background: 'var(--bg-color)', padding: '20px', borderRadius: '15px' }}>
                <h4>{t('language')}</h4>
                <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)} style={{ width: '100%' }}>
                    <option value="ru">Русский</option>
                    <option value="cs">Čeština</option>
                    <option value="en">English</option>
                </select>
            </div>

            <div style={{ marginBottom: '30px', background: 'var(--bg-color)', padding: '20px', borderRadius: '15px' }}>
                <h4>{t('theme')}</h4>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => toggleTheme('light')} style={{ flex: 1, padding: '10px', background: '#fff', color: '#333', border: '1px solid #ddd' }}>☀️ {t('light')}</button>
                    <button onClick={() => toggleTheme('dark')} style={{ flex: 1, padding: '10px', background: '#333', color: '#fff', border: 'none' }}>🌙 {t('dark')}</button>
                </div>
            </div>

            <div style={{ background: 'var(--bg-color)', padding: '20px', borderRadius: '15px' }}>
                <h4>{t('change_pass')}</h4>
                {step === 1 ? (
                    <button onClick={handleRequestCode} style={{ padding: '12px', background: 'var(--primary)', color: '#fff', border: 'none', width: '100%' }}>
                        {t('request_code')}
                    </button>
                ) : (
                    <form onSubmit={handlePasswordChange}>
                        <p style={{fontSize: '0.9rem', color: '#666'}}>{t('code_sent')}</p>
                        <input type="text" placeholder={t('code_6_digits')} value={code} onChange={e => setCode(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }} />
                        <input type="password" placeholder={t('new_pass')} value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={{ width: '100%', boxSizing: 'border-box', marginBottom: '15px' }} />
                        <div style={{display: 'flex', gap: '10px'}}>
                            <button type="submit" style={{ flex: 2, padding: '12px', background: '#48bb78', color: '#fff', border: 'none' }}>{t('save')}</button>
                            <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '12px', background: '#a0aec0', color: '#fff', border: 'none' }}>{t('cancel')}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Profile;