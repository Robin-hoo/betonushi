import { api } from "./client";
import type { User } from "./auth.api";
import {
    DISLIKED_INGREDIENT_OPTIONS,
    GROUP_SIZE_OPTIONS,
    GENRE_OPTIONS,
    PRIVATE_ROOM_OPTIONS,
    PRIORITY_OPTIONS,
    TASTE_OPTIONS,
    type DislikedIngredientOption,
    type GenreOption,
    type GroupSizeOption,
    type PreferenceData,
    type PriorityOption,
    type PrivateRoomOption,
    type TasteOption,
} from "@/types/preferences";

interface UpdateProfileData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dob: string;
}

interface PreferenceResponse {
    favorite_taste?: string;
    disliked_ingredients?: string;
    dietary_criteria?: string;
    target_name?: string;
    priorities?: string;
    private_room?: string;
    group_size?: string;
    updated_at?: string;
    [key: string]: unknown;
}

function isEnumValue<T extends string>(value: string, allowed: readonly T[]): value is T {
    return allowed.includes(value as T);
}

function parseEnumArray<T extends string>(value: string | undefined, allowed: readonly T[]): T[] {
    if (!value) {
        return [];
    }

    return value
        .split(",")
        .map((item) => item.trim())
        .filter((item): item is T => isEnumValue(item, allowed));
}

function parseEnumValue<T extends string>(value: string | undefined, allowed: readonly T[]): T | undefined {
    return value && isEnumValue(value, allowed) ? (value as T) : undefined;
}

export const updateProfile = async (data: UpdateProfileData): Promise<{ message: string; user: User }> => {
    const response = await api.put("/users/profile", data);
    return response.data;
};

export const getPreferences = async (): Promise<PreferenceData[]> => {
    const response = await api.get<PreferenceResponse[]>("/preferences");
    return response.data.map((prefs) => {
        const { favorite_taste, disliked_ingredients, dietary_criteria, priorities, private_room, group_size, ...rest } = prefs;

        return {
            ...rest,
            favorite_taste: parseEnumArray(favorite_taste, TASTE_OPTIONS),
            disliked_ingredients: parseEnumArray(disliked_ingredients, DISLIKED_INGREDIENT_OPTIONS),
            dietary_criteria: parseEnumArray(dietary_criteria, GENRE_OPTIONS),
            priorities: parseEnumArray(priorities, PRIORITY_OPTIONS),
            private_room: parseEnumValue(private_room, PRIVATE_ROOM_OPTIONS),
            group_size: parseEnumValue(group_size, GROUP_SIZE_OPTIONS),
        };
    });
};
