import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function OAuth2Redirect() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const email = params.get('email');

        if (email) {
            localStorage.setItem('email', email);
            navigate('/home');
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}>
            <h2>{t('auth_google')}</h2>
        </div>
    );
}

export default OAuth2Redirect;