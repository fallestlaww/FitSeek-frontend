import axios from 'axios';

const API_URL = 'http://localhost:9060';

class AuthService {
  async login(username, password) {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { username, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      if (response.data.token) {
        localStorage.setItem(
          'user',
          JSON.stringify({
            token: response.data.token,
            email: username,
          }),
        );
        console.log('Token saved:', response.data.token); // Log the token
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.response);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  async getUserProfile() {
    const user = this.getCurrentUser();
    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    return response.data;
  }

  async updateUserProfile(userData) {
    const user = this.getCurrentUser();
    const response = await axios.put(`${API_URL}/user/update`, userData, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  }

  async deleteUser() {
    const user = this.getCurrentUser();
    await axios.delete(`${API_URL}/user/delete`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    this.logout();
  }

  async getTrainingTypeInformation(trainingTypeRequest) {
    const user = this.getCurrentUser();
    try {
      const response = await axios.post(
        `${API_URL}/training-type/information`,
        trainingTypeRequest, // this should be { name: "FullBody" } or { name: "Split" }
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching training type information:', error.response);
      throw error;
    }
  }

  async getTrainingTypeExercises(userInfo) {
    const user = this.getCurrentUser();
    try {
      const response = await axios.post(`${API_URL}/training-type/exercises`, userInfo, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error.response);
      throw error;
    }
  }
}

const authService = new AuthService(); // Initialize the AuthService
export default authService;
