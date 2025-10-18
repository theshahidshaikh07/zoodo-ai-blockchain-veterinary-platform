// Simple test to verify the API service is working
const AI_SERVICE_URL = 'http://localhost:8000';

async function testAIService() {
    console.log('Testing AI Service...');
    
    try {
        const request = {
            message: 'hi',
            session_id: 'test_frontend_session'
        };
        
        console.log('Sending request:', request);
        
        const response = await fetch(`${AI_SERVICE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`AI Service error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('AI Service response:', data);
        console.log('Response field:', data.response);
        console.log('Response length:', data.response ? data.response.length : 0);
        
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Run the test
testAIService();
