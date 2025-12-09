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
        avatarUrl: string;
    };
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", data);
    if (!response.data.user.avatarUrl) {
        response.data.user.avatarUrl = "/food.jpg";
    }
    return response.data;
};

export interface RegisterRequest {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    address: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterResponse {
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/register", data);
    console.log(response.data);
    return response.data;
};
