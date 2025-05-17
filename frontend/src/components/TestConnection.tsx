import React, { useState } from 'react';
import { apiService } from '../services/api';

export const TestConnection: React.FC = () => {
    const [status, setStatus] = useState<string>('');
    const [error, setError] = useState<string>('');

    const testConnection = async () => {
        try {
            setStatus('Testing connection...');
            setError('');

            // Test with a sample style quiz
            const testResponse = await apiService.submitStyleQuiz('test-user', {
                preferredRooms: [{
                    imageId: 'test',
                    description: 'Test room',
                    selected: true
                }],
                textures: ['soft'],
                safetyFactors: ['lighting'],
                culturalPreferences: ['modern'],
                accessibilityNeeds: ['open-space']
            });

            setStatus('Connection successful!');
            console.log('Test response:', testResponse);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Connection failed');
            setStatus('');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>
            <button
                onClick={testConnection}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Test Connection
            </button>
            
            {status && (
                <p className="mt-4 text-green-600">{status}</p>
            )}
            
            {error && (
                <p className="mt-4 text-red-600">{error}</p>
            )}
        </div>
    );
}; 