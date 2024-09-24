/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

// Create an axios instance for the login API
export const axiosLogin = axios.create({

  baseURL: "https://primeqas.nipponpaint.co.in/log/api/Auth", // Base URL for your authentication API
});

export const axiosMarketMapping=axios.create({
  baseURL: "https://primeqas.nipponpaint.co.in/log/api",

})

export const setAuthIncerceptor = (token: string) => {
  axiosMarketMapping.defaults.headers.Authorization = `Bearer ${token}`;
};

// Function to handle the login request
export const loginUserApi = async (data: any) => {
 
    // Make the POST request to the '/Login' endpoint
    const response = await axiosLogin.post('/login', data);
    return response.data;

};

export const GetDashboardAPI=async()=>{
  const res=(await axiosMarketMapping.get("/EngineeringLog/dashboard")).data
  return res
}