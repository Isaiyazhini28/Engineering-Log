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
import forget from '../assets/forget.jpg';

const emailSchema = z.object({
  email: z.string().email('Invalid email'),
});

function Forget() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleClick = () => {
    try {
      emailSchema.parse({ email });
      setError(''); 
      navigate("/Otp");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
    }
  };

  return (
    <><div className="flex items-center justify-center h-screen">
      <Card className="w-[350px] h-[380px] justify-center content-center border-sky-400">
        <CardHeader>
          <CardTitle>
            <div className="grid grid-cols-1 gap-2 place-items-center text-blue-400">
              <div>Forget Password</div>
            </div>
          </CardTitle>
          <CardDescription className="grid grid-cols-1 gap-2 place-items-center text-blue-400">
            Reset your password!
          </CardDescription>
          <hr></hr>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 items-start space-y-2 text-blue-400">
          <div className="flex justify-start">
            <Label htmlFor="email">Email</Label></div>
            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </CardContent>
        <CardFooter>
          <div className="flex space-x-36">
            <div className="flex flex-col">
              <Button className="w-full bg-blue-400" onClick={handleClick}>Reset</Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div><style>
        {`
body {
background-image: url(${forget});
background-size: cover;
background-position: center;
background-attachment: fixed;
min-height: 100vh;
}
`}
      </style></>

  );
}

export default Forget;
