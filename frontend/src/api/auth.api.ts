import { api } from "./client";

export interface LoginRequest {
    email?: string;
    password?: string;
}

export interface LoginResponse {
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", data);
    return response.data;
};
