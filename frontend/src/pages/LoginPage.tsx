import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { useAuth } from '@/context/AuthContext';

const LoginPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { login: contextLogin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Errors
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const validateEmail = (e: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(e);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');
        setGeneralError('');

        let isValid = true;

        if (!email) {
            setEmailError(t('loginPage.error.required'));
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError(t('loginPage.error.invalid_email'));
            isValid = false;
        }

        if (!password) {
            setPasswordError(t('loginPage.error.required'));
            isValid = false;
        }

        if (!isValid) return;

        try {
            const response = await login({ email, password });
            // Assuming response contains token/user
            console.log('Login success:', response);
            // Store token (e.g., localStorage)
            // Use context to update state
            contextLogin(response.token, response.user);
            // Redirect to home
            navigate('/');
        } catch (err: any) {
            console.error('Login failed:', err);
            // Always show unified error message for auth failures
            setGeneralError(t('loginPage.error.failed'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-[500px] py-10">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-8 drop-shadow-md">
                    {t('loginPage.title')}
                </h2>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            {t('loginPage.email.label')}
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 ${emailError ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder={t('loginPage.email.placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && (
                            <p className="text-red-500 text-xs pl-2">{emailError}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">
                            {t('loginPage.password.label')}
                        </label>
                        <input
                            type="password"
                            className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 ${passwordError ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder={t('loginPage.password.placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {passwordError && (
                            <p className="text-red-500 text-xs pl-2">{passwordError}</p>
                        )}
                    </div>

                    {/* General Error */}
                    {generalError && (
                        <div className="text-red-500 text-center text-sm">
                            {generalError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#A9383E] text-white font-bold py-3 rounded-full hover:bg-[#8e2f34] transition duration-300 shadow-md"
                    >
                        {t('loginPage.button')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {t('loginPage.directory.text')}{' '}
                    <a href="/register" className="text-blue-400 hover:underline">
                        {t('loginPage.directory.link')}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
