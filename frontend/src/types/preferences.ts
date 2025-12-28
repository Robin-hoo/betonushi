export const GENRE_OPTIONS = ["vegetarian", "warm", "other", "noodle", "cold"] as const;
export type GenreOption = (typeof GENRE_OPTIONS)[number];

export const TASTE_OPTIONS = ["sweet", "sour", "other", "salty", "bitter", "umami", "spicy"] as const;
export type TasteOption = (typeof TASTE_OPTIONS)[number];

export const DISLIKED_INGREDIENT_OPTIONS = ["dog", "blood", "frog", "buffalo", "snake", "organs", "other"] as const;
export type DislikedIngredientOption = (typeof DISLIKED_INGREDIENT_OPTIONS)[number];

export const PRIORITY_OPTIONS = ["taste", "nutrition", "other", "price", "looks", "health", "quantity"] as const;
export type PriorityOption = (typeof PRIORITY_OPTIONS)[number];

export const PRIVATE_ROOM_OPTIONS = ["privateYes", "privateNo", "privateAny"] as const;
export type PrivateRoomOption = (typeof PRIVATE_ROOM_OPTIONS)[number];

export const GROUP_SIZE_OPTIONS = ["people1", "people2", "people34", "people56", "people7"] as const;
export type GroupSizeOption = (typeof GROUP_SIZE_OPTIONS)[number];

export interface PreferenceData {
    favorite_taste?: TasteOption[];
    disliked_ingredients?: DislikedIngredientOption[];
    dietary_criteria?: GenreOption[];
    target_name?: string;
    priorities?: PriorityOption[];
    private_room?: PrivateRoomOption;
    group_size?: GroupSizeOption;
    updated_at?: string;
}
