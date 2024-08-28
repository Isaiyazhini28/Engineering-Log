import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import loginimg from '../assets/loginimg.jpg';
import logo from '../assets/logo.png'
import { useQuery } from '@tanstack/react-query';
import queryClient from '../pages/queryClient';


const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function Login() {

  const { data, isLoading, isError } = useQuery('loginData', async () => {
    const response = await fetch('https://sparkqas-api.nipponpaint.co.in/api/Users/BusinessUnits');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching login data</p>;


  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSignupClick = () => {
    navigate("/Signup");
  };

  const handleClick = () => {
   
    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      
      const errorMessages: { email?: string; password?: string } = {};
      validationResult.error.errors.forEach((error) => {
        errorMessages[error.path[0] as keyof typeof errorMessages] = error.message;
      });
      setErrors(errorMessages);
    } else {
     
      setErrors({});
      navigate("/Home");
    }
  };

  const handleForgotPasswordClick = () => {
    navigate('/Forget');
  };

  return (
    <>
      <Card className="w-[350px] h-[450spx] justify-center items-center content-center border-sky-400">
        <CardHeader>
          <CardTitle>
          <div className=" flex items-center justify-center">
          <img src={logo} className="w-16 h-16 mb-4"></img></div>
            <div className="grid grid-cols-350 gap-2 place-items-center text-blue-400">
              <div>Login</div>
            </div>
          </CardTitle>
          <CardDescription className="grid grid-cols-350 gap-2 place-items-center text-blue-400">
            Enter your email and password below to login!
          </CardDescription>
          <hr></hr>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 items-start space-y-2 text-blue-400">
          <div className="flex justify-start">
            <Label htmlFor="email">Email</Label></div>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <p className="text-red-500 flex justify-start text-sm">{errors.email}</p>}
          </div><br></br>
          <div className="grid gap-2 items-start space-y-2 text-blue-400">
          <div className="flex justify-start">
            <Label htmlFor="password">Password</Label></div>
            <Input id="password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {errors.password && <p className="text-red-500 flex justify-start text-sm">{errors.password}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex space-x-36">
            <div className="flex flex-col">
              <Button className="w-full basis-1/2 bg-blue-400" onClick={handleClick}>Sign in</Button>
            </div>
            <Button className="w-full basis-1/2 bg-blue-400" onClick={handleSignupClick}>Sign up</Button>
          </div>
        </CardFooter>
        <Button className="w-30 flex justify-start underline underline-offset-4 hover:text-primary bg-transparent text-blue-400" onClick={handleForgotPasswordClick}>Forget Password?</Button>
      </Card>
      <style>
        {`
          body {
            background-image: url(${loginimg});
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 100vh;
            overflow:hidden;
          }
        `}
      </style>
    </>
  );
}

export default Login;