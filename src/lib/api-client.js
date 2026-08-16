import axios from 'axios';

// Mock API Client based on vanilla_legacy/api-client.js
const apiClient = axios.create({
  baseURL: '/api', // Khi có backend thực tế, thay bằng process.env.NEXT_PUBLIC_API_URL
  timeout: 10000,
});

export const API = {
  // Lấy danh sách địa điểm từ Database
  getPlaces: async (params = {}) => {
    try {
      const { data } = await apiClient.get('/places', { params });
      return data.data; // Trả về mảng places
    } catch (error) {
      console.error('Error fetching places:', error);
      throw error;
    }
  },

  /**
   * Tạo lịch trình dựa trên answers từ Zustand store
   */
  generateTrip: async (preferences) => {
    try {
      // Simulate API call delay (2.5 seconds)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Ở bản thật, đây sẽ là:
      // const response = await apiClient.post('/v1/trips/generate', { preferences });
      // return response.data;
      
      // Mock response
      return {
        success: true,
        trip_id: 'trip_' + Math.random().toString(36).substr(2, 9),
        data: {
          title: "Huế: Hành trình khám phá cá nhân hóa",
          preferences_used: preferences,
        }
      };
    } catch (error) {
      console.error("Error generating trip:", error);
      throw error;
    }
  }
};

export default apiClient;
