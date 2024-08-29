import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from 'react';
import { z } from 'zod';
import otpImage from '../assets/otp.jpg';


const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

function Otp() {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = () => {
    try {
      otpSchema.parse({ otp });
      setError(''); 
      alert('OTP validated successfully!'); 
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
          <div className="text-blue-400">
            <CardTitle>OTP</CardTitle>
          </div>
          <CardDescription className="text-blue-400">Enter your OTP!</CardDescription>
          <hr></hr>
        </CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="grid justify-items-center">
            <InputOTP maxLength={6} onChange={(value) => setOtp(value)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <div className="flex justify-center space-x-4">
            <Button className="bg-blue-400" onClick={handleSubmit}>Submit OTP</Button>
            <Button className="bg-blue-400">Resend OTP</Button>
          </div>
        </div>
      </Card>
    </div><style>
        {`
body {
background-image: url(${otpImage});
background-size: cover;
background-position: center;
background-attachment: fixed;
min-height: 100vh;
}
`}
      </style></>


  );
}

export default Otp;
