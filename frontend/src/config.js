// API Configuration
// In production, this will be set by Vercel environment variables
// For local development, it defaults to localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

export default {
  API_BASE_URL,
  ENDPOINTS: {
    GENERATE_QUIZ: `${API_BASE_URL}/generate-quiz`,
    GET_QUIZZES: `${API_BASE_URL}/quizzes`,
    GET_QUIZ: (id) => `${API_BASE_URL}/quiz/${id}`,
  }
};

