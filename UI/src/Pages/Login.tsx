import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import logo from "../assets/logo.png";
import login_real from "../assets/loginimg.jpg";
import { loginUserApi } from "@/services/api";

type LoginData = {
  userId: string;
  password: string;
};

// Define the login schema
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const { mutate: loginApiCall } = useMutation({
    mutationFn: (data: LoginData) => loginUserApi(data),
    onError: (error) => console.log(error, "login error"),
    onSuccess: (response) => {
      console.log(response, "testlogin");
      sessionStorage.setItem("token", response.token);
      window.location.reload();
    },
  });

  const handleClick = () => {
    const validationResult = loginSchema.safeParse({ username, password });

    if (!validationResult.success) {
      const errorMessages: { username?: string; password?: string } = {};
      validationResult.error.errors.forEach((error) => {
        errorMessages[error.path[0] as keyof typeof errorMessages] = error.message;
      });
      setErrors(errorMessages);
    } else {
      setErrors({});
      let input = { userId:username, password:password };
      loginApiCall(input);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-pink to-blue">
      <Card className="w-[1000px] h-[500px] mb:max-w-md p-8 border-beige flex justify_center items-center ml-10 bg-beige rounded-3xl shadow-2xl">
        <div className="flex space-x-10 items-start">
          <div className="flex place-items-start justify-items-start border-collapse">
            <img
              src={login_real}
              className="w-[450px] h-[485px] mb-0 rounded-full"
              alt="Logo"
            />
          </div>
          <div className="grid gap-4 w-[350px] mt-11">
            <div className="grid gap-2 items-start space-y-2 text-indigo-950">
              <div className="flex items-center justify-center">
                <img src={logo} className="w-25 h-16 mb-4" alt="Logo" />
              </div>
              <div className="flex justify-start">
                <Label htmlFor="username">Username</Label>
              </div>

              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none shadow-black focus:ring-2 focus:ring-indigo-950 focus:border-transparent shadow-sm"
              />

              {errors.username && (
                <p className="text-red-500 flex justify-start text-sm">
                  {errors.username}
                </p>
              )}
            </div>

            <div className="grid gap-2 items-start space-y-2 text-indigo-950">
              <div className="flex justify-start">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none shadow-black focus:ring-2 focus:ring-indigo-950 focus:border-transparent shadow-sm"
              />
              {errors.password && (
                <p className="text-red-500 flex justify-start text-sm">
                  {errors.password}
                </p>
              )}
            </div>
            <Button
              className="w-20 flex justify-start bg-indigo-950 ml-[9rem]"
              onClick={handleClick}
            >
              LOGIN
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;