import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, updateUser, isLoading } = useAuth(); // Get user and loading state from context
    const navigate = useNavigate();
    // Helper to format date if needed, or just display raw string
    const [canEdit, setCanEdit] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Local state for form fields
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dob: ""
    });

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/login');
        } else if (user) {
            // Initialize form data when user loads
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                dob: user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : ""
            });
        }
    }, [user, isLoading, navigate]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Save 
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { updateProfile } = await import('../api/profile.api');
            const data = {
                ...formData,
            };

            // Simple conversion if format is DD/MM/YYYY
            if (formData.dob && formData.dob.includes('/')) {
                const parts = formData.dob.split('/');
                if (parts.length === 3) {
                    data.dob = `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            const response = await updateProfile(data);

            // Start updating the AuthContext with new user data
            updateUser(response.user);

            toast.success(t("profilePage.saveSuccess") || "Profile updated successfully!");
            setCanEdit(false);
        } catch (error) {
            console.error("Failed to update profile", error);
            toast.error(t("profilePage.saveError") || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    // Handle Cancel
    const handleCancel = () => {
        // Reset form data to current user data
        if (user) {
            setFormData({
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                dob: user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : ""
            });
        }
        setCanEdit(false);
    };

    return (
        <div className="min-h-screen bg-white md:bg-gray-50/30 py-10 px-4">
            <h1 className="text-4xl font-bold text-center mb-16 tracking-wide text-black">{t("profilePage.title")}</h1>

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-center gap-16">

                {/* Left Column: Avatar */}
                <div className="flex flex-col items-center gap-8">
                    <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl bg-gray-900 relative">
                        <img
                            src={user?.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.fullName || 'User'}&backgroundColor=b6e3f4`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <Button disabled={isSaving} className="bg-[#ad343e] hover:bg-[#8b2b32] text-white rounded-full px-8 py-6 text-xl font-bold shadow-lg disabled:opacity-70">
                        {t("profilePage.changeAvatar")}
                    </Button>
                </div>

                {/* Right Column: Form */}
                <Card className="flex-1 w-[80vw] bg-white shadow-sm border border-gray-100 rounded-2xl p-8 md:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-xl font-bold text-gray-800 block">{t("profilePage.labels.name")}</label>
                            {canEdit ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg disabled:bg-gray-100"
                                />
                            ) : (
                                <p className="text-xl text-gray-600 py-3 border-b border-transparent">{formData.fullName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xl font-bold text-gray-800 block">{t("profilePage.labels.email")}</label>
                            {canEdit ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg disabled:bg-gray-100"
                                />
                            ) : (
                                <p className="text-xl text-gray-600 py-3 border-b border-transparent">{formData.email}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xl font-bold text-gray-800 block">{t("profilePage.labels.phone")}</label>
                            {canEdit ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg disabled:bg-gray-100"
                                />
                            ) : (
                                <p className="text-xl text-gray-600 py-3 border-b border-transparent">{formData.phone}</p>
                            )}
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                            <label className="text-xl font-bold text-gray-800 block">{t("profilePage.labels.dob")}</label>
                            {canEdit ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        placeholder="DD/MM/YYYY"
                                        disabled={isSaving}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg disabled:bg-gray-100"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-xl text-gray-600 py-3 border-b border-transparent">{formData.dob}</p>
                            )}
                        </div>

                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xl font-bold text-gray-800 block">{t("profilePage.labels.address")}</label>
                            {canEdit ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    disabled={isSaving}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg disabled:bg-gray-100"
                                />
                            ) : (
                                <p className="text-xl text-gray-600 py-3 border-b border-transparent">{formData.address}</p>
                            )}
                        </div>

                    </div>

                    <div className="w-full flex justify-center mt-12 gap-6">
                        {canEdit ? (
                            <>
                                <Button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-12 py-6 text-xl font-bold shadow-lg transition-all min-w-[160px] disabled:bg-blue-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? t("profilePage.saving") : t("profilePage.save")}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-12 py-6 text-xl font-bold shadow-md transition-all min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t("profilePage.cancel")}
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={() => setCanEdit(true)}
                                className="bg-[#ad343e] hover:bg-[#8b2b32] text-white rounded-full px-12 py-6 text-xl font-bold shadow-lg transition-all min-w-[200px]"
                            >
                                {t("profilePage.edit")}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>

            {/* Survey History Section */}
            <div className="max-w-5xl mx-auto mt-20">
                <h2 className="text-3xl font-bold text-center mb-8 text-black tracking-wide">{t("profilePage.surveyHistory.title")}</h2>

                <div className="space-y-4">
                    {mockSurveyHistory.map((survey, index) => (
                        <SurveyHistoryItem key={index} survey={survey} t={t} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Mock Data for Survey History
const mockSurveyHistory = [
    {
        name: "木村 太郎 先生",
        q1: ["vegetarian", "warm"],
        q2: ["sweet", "salty"],
        q3: ["dog"],
        q4: ["taste", "health"],
        q5: "private",
        q6: "people1"
    },
    {
        name: "田中 次郎 先輩",
        q1: ["cold"],
        q2: ["spicy"],
        q3: [],
        q4: ["price"],
        q5: "open",
        q6: "people34"
    },
    {
        name: "高橋 一郎 先生",
        q1: ["warm"],
        q2: ["sweet"],
        q3: ["cat"],
        q4: ["taste"],
        q5: "any",
        q6: "people2"
    }
];

// Sub-component for individual survey item (Accordion)
const SurveyHistoryItem = ({ survey, t }: { survey: any, t: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    // Stop propagation for delete button to prevent toggling accordion
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(t("profilePage.surveyHistory.delete") + "?")) {
            console.log("Delete survey", survey.name);
            toast.success("Deleted!");
        }
    };

    const handleViewRecommendation = async () => {
        // Dynamically import to avoid circular dependencies if any, though here it's fine.
        // Better to just import at top level, but for localized change:
        const { mapSurveyToFilters } = await import('../utils/surveyMapping');

        const filters = mapSurveyToFilters(survey);
        const params = new URLSearchParams();

        if (filters.types.length > 0) params.append('types', filters.types.join(','));
        if (filters.flavors.length > 0) params.append('flavors', filters.flavors.join(','));
        if (filters.ingredients.length > 0) params.append('ingredients', filters.ingredients.join(','));

        console.log("View recommendation for", survey.name, params.toString());
        navigate(`/foods?${params.toString()}`);
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <div
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-xl font-medium text-gray-700">{survey.name}</span>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDelete}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title={t("profilePage.surveyHistory.delete")}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Accordion Content */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-8 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        {/* Q1 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q1")}</p>
                            <div className="flex flex-wrap gap-2">
                                {survey.q1.map((ans: string) => (
                                    <span key={ans} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                        {t(`profilePage.surveyHistory.answers.${ans}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Q4 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q4")}</p>
                            <div className="flex flex-wrap gap-2">
                                {survey.q4.map((ans: string) => (
                                    <span key={ans} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                        {t(`profilePage.surveyHistory.answers.${ans}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Q2 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q2")}</p>
                            <div className="flex flex-wrap gap-2">
                                {survey.q2.map((ans: string) => (
                                    <span key={ans} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                        {t(`profilePage.surveyHistory.answers.${ans}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Q5 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q5")}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                    {t(`profilePage.surveyHistory.answers.${survey.q5}`)}
                                </span>
                            </div>
                        </div>

                        {/* Q3 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q3")}</p>
                            {survey.q3.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {survey.q3.map((ans: string) => (
                                        <span key={ans} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                            {t(`profilePage.surveyHistory.answers.${ans}`)}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">None</p>
                            )}
                        </div>

                        {/* Q6 */}
                        <div>
                            <p className="font-semibold text-gray-800 mb-2">{t("profilePage.surveyHistory.questions.q6")}</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                                    {t(`profilePage.surveyHistory.answers.${survey.q6}`)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            onClick={handleViewRecommendation}
                            className="bg-[#ad343e] hover:bg-[#8b2b32] text-white rounded-lg px-6 py-3 font-semibold shadow-md flex items-center gap-2"
                        >
                            <span>{t("profilePage.surveyHistory.viewRecommendation")}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
