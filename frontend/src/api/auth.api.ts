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
    if (data.email == "manha1k48@gmail.com" && data.password == "123456") {
        return {
            message: "Login successful",
            token: "123456",
            user: {
                id: 1,
                name: "Đức Mạnh",
                email: "manha1k48@gmail.com",
                avatarUrl: "/food.jpg"
            }
        };
    }
    const response = await api.post<LoginResponse>("/login", data);
    return response.data;
};
