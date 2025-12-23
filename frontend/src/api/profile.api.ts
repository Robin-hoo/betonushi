import { api } from "./client";
import type { User } from "./auth.api";

interface UpdateProfileData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const response = await api.put("/users/profile", data);
    return response.data;
};
