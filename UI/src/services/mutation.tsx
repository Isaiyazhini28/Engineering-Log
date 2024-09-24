import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { setCookie } from '@/Authenticated/authenticated'; // Assuming this is a named export
import { loginUserApi } from './api';
 // Ensure this is the correct function name

const COOKIE_KEY = 'your_cookie_key'; // Define your cookie key

function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate: loginMutate } = useMutation({
    mutationFn: (data: { username: string; password: string }) => loginUserApi(data), // Call the API function
    onError: (error: unknown) => {
      console.error(error); // Improved error handling
      toast.error("Login failed. Please try again.");
    },
    onSuccess: (data: any) => {
      if (data.status !== 200) {
        toast.error("Login password is wrong");
        return;
      }
      setCookie(COOKIE_KEY, data.data, { path: "/" }); // Ensure correct path for the cookie

      // Navigate based on the location pathname
      const redirectTo = location.state?.from || "/";
      navigate(redirectTo);
    },
  });

  return { loginMutate };
}

export default useLogin;

