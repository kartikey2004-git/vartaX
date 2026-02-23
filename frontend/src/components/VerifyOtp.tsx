/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "./Loading";
import ThemeToggle from "./ThemeToggle";

const VerifyOtp = () => {
  const {
    isAuth,
    setIsAuth,
    setUser,
    loading: userLoading,
    fetchChats,
    fetchUsers,
  } = useAppData();

  const [loading, setLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [error, setError] = useState<string>("");

  // state for resend otp button loading
  const [resendLoading, setResendLoading] = useState(false);

  // state for timer after 60 seconds user can resend the otp
  const [timer, setTimer] = useState(60);

  // ref for input fields jisse hum inputs ke beech mein switch kr skte hai , focus kr skte hai

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();

  // we are going to use useSearchParams to get the email from the query params we need to wrap this component inside Suspense in the verify page

  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  // timer chalayenge jab component mount hoga aur jab timer 0 se bada hoga tabhi chalega and har second mein timer ko 1 se kam karenge

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // console.log(timer);

  // function to handle input change and move to next input field automatically

  const handleInputChange = (value: string, index: number): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // function to handle backspace key press and move to previous input field if current input field is empty

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>,
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // function to handle paste event and paste the otp in the input fields

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasteData = e.clipboardData.getData("text");

    const digits = pasteData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  // function to handle form submit and verify the otp

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please Enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    // Send a POST request to the backend to verify the otp

    try {
      const { data } = await axios.post(`${user_service}/api/v1/verify-user`, {
        email,
        otp: otpString,
      });
      toast.success(data.message);

      // If successful, store the token in cookies expires in 15 days and update the user context

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false, // we have to host our app on AWS , so we got http in the beginning of the URL
        path: "/",
      });

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setUser(data.user);
      setIsAuth(true);

      fetchChats(); // problem solved ab jaise hi user verified hoga toh loggedIn users ki saari chat phirse fetch hongi

      fetchUsers(); // problem solved ab jaise hi user verified hoga toh all users ki saari details phirse fetch hongi
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // function to handle resetOTP after 60 seconds

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    // Send a POST request to the backend to login through email which send reset otp again

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });
      toast.success(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setResendLoading(false);
    }
  };

  if (userLoading) return <Loading />;
  if (isAuth) redirect("/chat");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-3 text-foreground sm:px-6">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm sm:p-8">
        <div className="relative mb-8 text-center">
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            size="icon"
            className="absolute left-0 top-0 h-9 w-9 rounded-md text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft />
          </Button>

          <div className="absolute right-0 top-0">
            <ThemeToggle />
          </div>

          <h1 className="mb-3 text-xl font-medium text-foreground sm:text-2xl md:text-3xl">
            Verify Your Email
          </h1>

          <p className="text-sm text-muted-foreground sm:text-base">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="text-foreground">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label className="text-center text-muted-foreground font-semibold mb-4">
              Enter your 6 digit OTP here
            </Label>

            <div
              className="flex justify-between gap-2 sm:gap-3 mb-6"
              onPaste={handlePaste}
            >
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  className="h-10 w-10 rounded-md border bg-input text-center text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 sm:h-12 sm:w-12 sm:text-xl"
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className={`flex w-full items-center justify-center gap-2 rounded-md py-3 font-normal transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/95"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="relative mt-6">
          <p className="text-muted-foreground text-sm mb-2 text-center">
            Didn&apos;t receive the code?
          </p>

          {timer > 0 ? (
            <p className="text-sm text-muted-foreground text-center">
              Resend code in {timer}s
            </p>
          ) : (
            <div className="flex justify-center">
              <Button
                variant="secondary"
                className="text-sm font-normal"
                disabled={resendLoading}
                onClick={handleResendOtp}
              >
                {resendLoading ? "Sending..." : "Resend Code"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
