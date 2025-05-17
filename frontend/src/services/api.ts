const API_BASE_URL = '/api';

export interface StyleQuizResponse {
    preferredRooms: Array<{
        imageId: string;
        description: string;
        selected: boolean;
    }>;
    textures: string[];
    safetyFactors: string[];
    culturalPreferences: string[];
    accessibilityNeeds: string[];
}

export interface Recommendation {
    id: string;
    score: number;
    metadata: {
        description: string;
        tags: string[];
        [key: string]: any;
    };
}

class ApiService {
    // Process and store an image
    async processImage(imageFile: File) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_BASE_URL}/recommendations/process-image`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to process image');
        }

        return response.json();
    }

    // Submit style quiz
    async submitStyleQuiz(userId: string, responses: StyleQuizResponse) {
        const response = await fetch(`${API_BASE_URL}/style-quiz/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, responses })
        });

        if (!response.ok) {
            throw new Error('Failed to submit style quiz');
        }

        return response.json();
    }

    // Get personalized recommendations
    async getRecommendations(userId: string, limit: number = 5): Promise<{
        userSummary: string;
        recommendations: Recommendation[];
    }> {
        const response = await fetch(
            `${API_BASE_URL}/style-quiz/recommendations/${userId}?limit=${limit}`
        );

        if (!response.ok) {
            throw new Error('Failed to get recommendations');
        }

        return response.json();
    }
}

export const apiService = new ApiService(); 