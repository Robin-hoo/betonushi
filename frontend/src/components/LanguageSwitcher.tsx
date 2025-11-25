import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="language-switcher">
            <button onClick={() => changeLanguage('en')} disabled={i18n.language === 'en'}>
                Eng
            </button>
            <button onClick={() => changeLanguage('vi')} disabled={i18n.language === 'vi'}>
                Vi
            </button>
        </div>
    );
};

export default LanguageSwitcher;
