import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

function Verify() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;
    const isLogin = location.state?.isLogin;

    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    if (!email) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px', color: 'var(--text-color)' }}>
                <h2>{t('email_not_found_error')}</h2>
                <button onClick={() => navigate('/login')} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>
                    {t('back_to_login')}
                </button>
            </div>
        );
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const url = isLogin ? '/auth/login/step2' : '/auth/verify';
            await api.post(url, { email, code });

            localStorage.setItem('email', email);
            navigate('/home');
        } catch (err) {
            const data = err.response?.data;
            const message = typeof data === 'string' ? data : (data?.message || t('invalid_code_error'));
            setError(message);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', margin: 0 }}>
            <div style={{ background: 'var(--card-bg)', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '350px', border: '1px solid var(--border-color)' }}>
                <h2 style={{ color: 'var(--text-color)', marginTop: 0 }}>{t('enter_code')}</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-color)', opacity: 0.8 }}>{t('code_sent_to')}<br/><b style={{color: 'var(--primary)'}}>{email}</b></p>

                <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder={t('code_6_digits')}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                        style={{ padding: '15px', fontSize: '16px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', width: '100%', boxSizing: 'border-box' }}
                    />
                    {error && <p style={{ color: '#fc8181', fontSize: '14px', margin: 0, fontWeight: 'bold' }}>{error}</p>}
                    <button type="submit" style={{ padding: '15px', background: '#48bb78', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                        {t('confirm')}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Verify;