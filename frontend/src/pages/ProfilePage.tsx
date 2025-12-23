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
        try {
            const { updateProfile } = await import('../api/profile.api');
            const data = {
                ...formData,
            };

            // Simple conversion if format is DD/MM/YYYY
            if (formData.dob && formData.dob.includes('/')) {
                const parts = formData.dob.split('/');
                if (parts.length === 3) {
                    // CAUTION: This expects DD/MM/YYYY
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
                    {/* Only show change avatar button if editing? Or always? Design usually implies always or in edit mode. 
                        User didn't specify, but let's keep it consistent. If "Edit Profile" is global, maybe hide this until edit mode?
                        Actually original design had it. Let's keep it but maybe disable if !canEdit? 
                        Or just leave it as is.
                    */}
                    <Button className="bg-[#ad343e] hover:bg-[#8b2b32] text-white rounded-full px-8 py-6 text-xl font-bold shadow-lg">
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
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg"
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
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg"
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
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg"
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
                                        className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg"
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
                                    className="w-full border border-gray-200 rounded-lg px-4 py-4 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ad343e]/20 text-lg"
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
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-12 py-6 text-xl font-bold shadow-lg transition-all min-w-[160px]"
                                >
                                    {t("profilePage.save")}
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-12 py-6 text-xl font-bold shadow-md transition-all min-w-[160px]"
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
        </div>
    );
};

export default ProfilePage;
