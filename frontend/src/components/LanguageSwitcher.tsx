import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'ja', label: "日本語" },
        { code: 'vi', label: 'Tiếng Việt' },
        { code: 'en', label: "English" }
    ];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <div className="language-switcher" ref={dropdownRef}>
            <button
                className="language-switcher-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                {currentLanguage.label}
                <svg
                    className={`language-switcher-arrow ${isOpen ? 'open' : ''}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                >
                    <path d="M3 5L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {isOpen && (
                <div className="language-switcher-dropdown">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-switcher-option ${i18n.language === lang.code ? 'active' : ''}`}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}

            <style>{`
                .language-switcher {
                    position: relative;
                    display: inline-block;
                }

                .language-switcher-button {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #1f2937;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 140px;
                    justify-content: space-between;
                }

                .language-switcher-button:hover {
                    background: #f9fafb;
                    border-color: #d1d5db;
                }

                .language-switcher-arrow {
                    transition: transform 0.2s ease;
                    color: #6b7280;
                }

                .language-switcher-arrow.open {
                    transform: rotate(180deg);
                }

                .language-switcher-dropdown {
                    position: absolute;
                    top: calc(100% + 4px);
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                    z-index: 50;
                    animation: slideDown 0.2s ease;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .language-switcher-option {
                    width: 100%;
                    padding: 10px 16px;
                    text-align: left;
                    background: white;
                    border: none;
                    font-size: 14px;
                    color: #1f2937;
                    cursor: pointer;
                    transition: background 0.15s ease;
                }

                .language-switcher-option:hover {
                    background: #f3f4f6;
                }

                .language-switcher-option.active {
                    background: #eff6ff;
                    color: #2563eb;
                    font-weight: 500;
                }

                .language-switcher-option:not(:last-child) {
                    border-bottom: 1px solid #f3f4f6;
                }
            `}</style>
        </div>
    );
};

export default LanguageSwitcher;