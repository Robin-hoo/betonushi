export interface SurveyData {
    q1?: string[]; // Preference: vegetarian, warm, cold
    q2?: string[]; // Taste: sweet, spicy, sour, salty
    q4?: string[]; // Priority: health, taste, price
    [key: string]: any;
}

export interface FilterParams {
    types: number[];
    flavors: number[];
    ingredients: number[];
}

/**
 * Maps survey answers to MenuPage filter IDs.
 * 
 * MenuPage Filter IDs reference:
 * Types: 1:Noodle, 2:Rice, 3:Bread, 4:SideDish, 5:Salad, 6:Hotpot
 * Flavors: 1:Sour, 2:Sweet, 3:Herb, 4:Light, 5:Spicy
 * Ingredients: 1:Beef, 2:Pork, 3:Chicken, 4:Seafood, 5:Vegetable
 */
export const mapSurveyToFilters = (survey: SurveyData): FilterParams => {
    const filters = {
        types: new Set<number>(),
        flavors: new Set<number>(),
        ingredients: new Set<number>()
    };

    // Q1: Diet/Temperature
    if (survey.q1) {
        if (survey.q1.includes('vegetarian')) {
            filters.ingredients.add(5); // Vegetable
        }
        if (survey.q1.includes('warm')) {
            // Warm dishes usually imply main courses like Ramen, Rice, Hotpot
            filters.types.add(1); // Noodle
            filters.types.add(2); // Rice
            filters.types.add(6); // Hotpot
        }
        if (survey.q1.includes('cold')) {
            // Cold dishes
            filters.types.add(5); // Salad
            // Could strictly imply cold noodles too, but let's stick to Salad for distinctness
        }
    }

    // Q2: Taste
    if (survey.q2) {
        if (survey.q2.includes('sweet')) filters.flavors.add(2);
        if (survey.q2.includes('spicy')) filters.flavors.add(5);
        if (survey.q2.includes('sour')) filters.flavors.add(1);
        // 'salty' is generic, no specific filter bit unless we had one.
    }

    // Q4: Priorities
    if (survey.q4) {
        if (survey.q4.includes('health')) {
            filters.flavors.add(4); // Light
            filters.ingredients.add(5); // Vegetable
        }
    }

    return {
        types: Array.from(filters.types),
        flavors: Array.from(filters.flavors),
        ingredients: Array.from(filters.ingredients)
    };
};
