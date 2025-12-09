import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, type RegisterRequest } from '../api/auth.api';
import { useTranslation } from 'react-i18next';

const RegisterPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: 'Male',
        dob: '',
        address: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const validate = () => {
        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return t("registerPage.error.invalid_email");

        // Phone
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(formData.phone)) return t("registerPage.error.invalid_phone");

        // Password
        let typesCount = 0;
        if (/[a-zA-Z]/.test(formData.password)) typesCount++;
        if (/\d/.test(formData.password)) typesCount++;
        if (/[^a-zA-Z0-9"']/.test(formData.password)) typesCount++;

        if (formData.password.length < 8 || typesCount < 2) {
            return t("registerPage.error.weak_password");
        }

        // Confirm Password
        if (formData.password !== formData.confirmPassword) {
            return t("registerPage.error.password_mismatch");
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await register(formData);
            console.log("Sign up successfully");
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || t("registerPage.error.failed"));
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center py-10 w-[90vw] max-w-[750px] mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">{t("registerPage.title")}</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.firstName.label")}</label>
                            <input
                                name="first_name"
                                placeholder={t("registerPage.firstName.placeholder")}
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.lastName.label")}</label>
                            <input
                                name="last_name"
                                placeholder={t("registerPage.lastName.placeholder")}
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.email.label")}</label>
                            <input
                                name="email"
                                placeholder={t("registerPage.email.placeholder")}
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.phone.label")}</label>
                            <input
                                name="phone"
                                placeholder={t("registerPage.phone.placeholder")}
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.gender.label")}</label>
                            <select
                                name="gender"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                            >
                                <option value="Male">{t("registerPage.gender.options.male")}</option>
                                <option value="Female">{t("registerPage.gender.options.female")}</option>
                                <option value="Other">{t("registerPage.gender.options.other")}</option>
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm font-medium mb-1">{t("registerPage.dob.label")}</label>
                            <input
                                type="date"
                                name="dob"
                                className="w-full border p-2 rounded"
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("registerPage.address.label")}</label>
                        <input
                            name="address"
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("registerPage.password.label")}</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">{t("registerPage.confirmPassword.label")}</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="w-full border p-2 rounded"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-700 text-white font-bold py-2 px-4 rounded hover:bg-red-800 transition"
                    >
                        {t("registerPage.button.submit")}
                    </button>

                    <div className="text-center mt-4 text-sm">
                        {t("registerPage.footer.text")} <Link to="/login" className="text-blue-600 hover:underline">{t("registerPage.footer.link")}</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
