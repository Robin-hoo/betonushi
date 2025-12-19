import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { register, type RegisterRequest } from '../api/auth.api';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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

        setSubmitting(true);
        try {
            await register(formData);
            console.log("Sign up successfully");
            toast.success(t("registerPage.success") || 'Registration successful');
            navigate('/login');
        } catch (err: any) {
            const message = err.response?.data?.message || t("registerPage.error.failed");
            setError(message);
            toast.error(message);
            console.error(err);
        } finally {
            setSubmitting(false);
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                                disabled={submitting}
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
                            disabled={submitting}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">
                            {t("registerPage.password.label")}
                        </label>

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="w-full border p-2 rounded pr-10"
                            onChange={handleChange}
                            required
                            disabled={submitting}
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(s => !s)}
                            disabled={submitting}
                            className="
                            absolute
                            right-3
                            top-[68%]
                            -translate-y-1/2
                            text-gray-500
                            hover:text-gray-700
                            disabled:opacity-50
                            "
                            aria-pressed={showPassword}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-1">{t("registerPage.confirmPassword.label")}</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            className="w-full border p-2 rounded pr-10"
                            onChange={handleChange}
                            required
                            aria-describedby="confirm-password-toggle"
                            disabled={submitting}
                        />
                        <button
                            type="button"
                            id="confirm-password-toggle"
                            onClick={() => setShowConfirmPassword(s => !s)}
                            disabled={submitting}
                            className="absolute
                                right-3
                                top-[68%]
                                -translate-y-1/2
                                text-gray-500
                                hover:text-gray-700
                                disabled:opacity-50
                            "
                            aria-pressed={showConfirmPassword}
                            title={showConfirmPassword ? t("registerPage.hide_password") : t("registerPage.show_password")}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        aria-busy={submitting}
                        className={`w-full text-white font-bold py-2 px-4 rounded transition ${submitting ? 'bg-red-600 opacity-60 cursor-not-allowed' : 'bg-red-700 hover:bg-red-800'}`}
                    >
                        {submitting ? (
                            <span className="inline-flex items-center justify-center">
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                {t("registerPage.button.submitting") || 'Registering...'}
                            </span>
                        ) : t("registerPage.button.submit")}
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
