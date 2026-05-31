import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

function Login() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/login/step1', { email, password });
            navigate('/verify', { state: { email, isLogin: true } });
        } catch (err) {
            const data = err.response?.data;
            const message = typeof data === 'string' ? data : (data?.message || t('server_error_or_wrong_password'));
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div style={styles.container}>
            <div style={styles.langSwitch}>
                <button type="button" onClick={() => changeLanguage('ru')} style={styles.langBtn(i18n.language === 'ru')}>RU</button>
                <button type="button" onClick={() => changeLanguage('en')} style={styles.langBtn(i18n.language === 'en')}>EN</button>
                <button type="button" onClick={() => changeLanguage('cs')} style={styles.langBtn(i18n.language === 'cs')}>CS</button>
            </div>

            <div style={styles.card}>
                <h2 style={styles.title}>{t('login')}</h2>
                <form onSubmit={handleLogin} style={styles.form}>
                    <input
                        type="email"
                        placeholder={t('email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder={t('password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    {error && <p style={styles.error}>{error}</p>}
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? '...' : t('login')}
                    </button>
                </form>

                <div style={styles.divider}>
                    <span style={styles.dividerText}>— {t('or')} —</span>
                </div>

                <a href="http://localhost:8080/oauth2/authorization/google" style={styles.googleButton}>
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{width: '24px', height: '24px'}}/>
                    <span>Google</span>
                </a>

                <p style={styles.footer}>
                    {t('no_account')} <span onClick={() => navigate('/')} style={styles.link}>{t('register')}</span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    container: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color)', margin: 0 },
    langSwitch: { display: 'flex', gap: '10px', marginBottom: '25px' },
    langBtn: (isActive) => ({
        padding: '8px 20px', background: isActive ? 'var(--primary)' : 'var(--card-bg)', color: isActive ? '#fff' : 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s'
    }),
    card: { background: 'var(--card-bg)', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', width: '350px', border: '1px solid var(--border-color)' },
    title: { marginTop: 0, marginBottom: '25px', textAlign: 'center', color: 'var(--text-color)', fontSize: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    input: { padding: '15px', fontSize: '16px', borderRadius: '15px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)', width: '100%', boxSizing: 'border-box', outline: 'none' },
    button: { padding: '15px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'all 0.2s' },
    error: { color: '#fc8181', fontSize: '14px', margin: 0, textAlign: 'center', fontWeight: 'bold' },
    divider: { display: 'flex', justifyContent: 'center', margin: '20px 0' },
    dividerText: { color: 'var(--text-color)', opacity: 0.5, fontSize: '14px' },
    googleButton: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', border: '1px solid var(--border-color)', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', transition: 'all 0.2s' },
    footer: { marginTop: '25px', textAlign: 'center', fontSize: '14px', color: 'var(--text-color)', opacity: 0.8 },
    link: { color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }
};

export default Login;