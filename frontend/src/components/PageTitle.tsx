import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function PageTitle() {
    const { t } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let titleKey = 'meta.title.default';

        if (path === '/') {
            titleKey = 'meta.title.home';
        } else if (path.startsWith('/foods')) {
            titleKey = 'meta.title.menu';
        } else if (path.startsWith('/restaurants')) {
            titleKey = 'meta.title.restaurant';
        } else if (path.startsWith('/phrases') || path.startsWith('/helpful')) {
            titleKey = 'meta.title.phrases';
        } else if (path === '/login') {
            titleKey = 'meta.title.login';
        } else if (path === '/register') {
            titleKey = 'meta.title.signup';
        }

        document.title = t(titleKey);
    }, [location, t]);

    return null;
}
