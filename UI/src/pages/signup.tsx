import { z } from 'zod';
import { useState } from 'react';
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
import signupimg from '../assets/signup.jpg';


const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long')
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/?]).*$/, 'Password must contain at least one uppercase letter and one special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], 
});


function Signup() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    try {
      signupSchema.parse({ email, password, confirmPassword });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="flex">
          <Card className="w-[400px] h-[600px] justify-center content-center border-sky-400">
            <CardHeader>
              <CardTitle>
                <div className="grid grid-cols-1 gap-2 place-items-center text-blue-400">
                  <div>Signup</div>
                </div>
              </CardTitle>
              <CardDescription className="grid grid-cols-1 gap-2 place-items-center text-blue-400">
                Create an account!
              </CardDescription>
              <hr></hr>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 items-start space-y-2 text-blue-400">
                <div className="flex justify-start">
                  <Label htmlFor="email">Email</Label>
                </div>
                <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
                {errors.email && <div className="text-red-500 text-sm flex justify-start">{errors.email}</div>}
              </div>
              <br></br>
              <div className="grid gap-2 items-start space-y-2 text-blue-400">
                <div className="flex justify-start">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password"  placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <div className="text-red-500 text-sm flex justify-start">{errors.password}</div>}
              </div><br></br>
              <div className="grid gap-2 items-start space-y-2 text-blue-400">
                <div className="flex justify-start">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                </div>
                <Input id="confirmPassword"  type="password"  placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className="text-red-500 text-sm flex justify-start">{errors.confirmPassword}</div>}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-400" onClick={handleSubmit}>
                Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <style>
        {`
      body {
        background-image: url(${signupimg});
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

export default Signup;
