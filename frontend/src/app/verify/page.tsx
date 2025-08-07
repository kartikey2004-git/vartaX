/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

const VerifyPage = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);

  const [error, setError] = useState<string>("");

  const [resendLoading, setResendLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const router = useRouter();

  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // console.log(timer);

  const handleInputChange = (value: string, index: number): void => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLElement>
  ): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please Enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/v1/verify-user`,
        {
          email,
          otp: otpString,
        }
      );
      toast(data.message);
      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      const { data } = await axios.post(`http://localhost:5000/api/v1/login`, {
        email,
      });
      toast(data.message);
      setTimer(60);
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f1117] text-foreground">
      <div className="absolute w-96 h-96 rounded-full bg-[#1f6feb]/30 blur-3xl animate-pulse -z-10"></div>

      <div className="w-full max-w-md bg-[#161b22]/90 rounded-3xl p-10 shadow-2xl border border-white/10 backdrop-blur-md transition-all">
        <div className="text-center mb-8 relative">
          <Button
            onClick={() => router.push("/login")}
            className="absolute top-0 left-0 p-2 text-gray-300 hover:text-white bg-[#0f1117] hover:bg-[#1a1d25]"
          >
            <ChevronLeft />
          </Button>
          <h1 className="text-3xl font-semibold text-white text-center mb-3">
            Verify Your Email
          </h1>
          <p className="text-center text-gray-400 mb-6">
            We’ve sent a 6-digit code to{" "}
            <span className="text-md text-white">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label className="text-center text-gray-400 font-semibold mb-6">
              Enter your 6 digit OTP here
            </Label>

            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el: HTMLInputElement | null) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  className="w-12 h-12 text-white bg-transparent border border-gray-400 text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#9f59ff] rounded-md"
                  onChange={(e) => handleInputChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-900 border-red-700 rounded-lg p-3">
              <p className="text-red-300 text-md text-center">{error}</p>
            </div>
          )}

          <Button
            variant="default"
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md transition duration-200 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#0f1117] hover:bg-[#1a1d25]"
            } text-white`}
          >
            {loading ? "Sending Otp to your mail..." : "Verify"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <div className="relative mt-6 h-20 w-full">
          <p className="text-gray-400 text-sm mb-2 text-center">
            Didn&apos;t receive the code?
          </p>

          {timer > 0 ? (
            <p className="text-sm text-gray-400 text-center">
              Resend code in {timer}s
            </p>
          ) : (
            <Button
              className="absolute bottom-0 right-0 bg-[#0f1117] hover:bg-[#1a1d25] text-white font-medium text-sm disabled:opacity-50"
              disabled={resendLoading}
              onClick={handleResendOtp}
            >
              {resendLoading ? "Sending..." : "Resend Code"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
