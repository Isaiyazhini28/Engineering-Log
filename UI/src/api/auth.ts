import axios from 'axios';

const SparkAPI=axios.create({baseURL:"https://sparkqas-api.nipponpaint.co.in/api/"})

// Define TypeScript interfaces for the request and response
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Function to handle user login
export const loginUser = async ()=> {
  try {
    // Make a POST request to the login endpoint
    const response = await SparkAPI.get('Users/BusinessUnits');
    return response.data; // Return the response data
  } catch (error) {
    // Handle any errors that occur during the request
    if (axios.isAxiosError(error)) {
      // Handle specific Axios errors (e.g., network issues, server errors)
      throw new Error(error.response?.data?.message || 'An error occurred while logging in.');
    } else {
      // Handle general errors
      throw new Error('An unexpected error occurred.');
    }
  }
};
