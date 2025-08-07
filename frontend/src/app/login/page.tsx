"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { TextEffect } from "../../../components/motion-primitives/text-effect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`http://localhost:5000/api/v1/login`, {
        email,
      });

      toast(data.message);

      router.push(`/verify?email=${email}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data?.message || "Server error occurred");
      } else {
        console.error("Unexpected error:", error);
        toast("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] relative overflow-hidden px-4">
      <div className="absolute w-96 h-96 rounded-full bg-[#1f6feb]/30 blur-3xl animate-pulse -z-10"></div>

      <div className="w-full max-w-md bg-[#161b22]/90 rounded-3xl p-10 shadow-2xl border border-white/10 backdrop-blur-md transition-all">
        <div className="text-center mb-8 select-none cursor-pointer">
          <h1 className="text-4xl font-semibold text-white tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#58a6ff] to-[#1f6feb] text-transparent bg-clip-text">
              vartaX
            </span>
          </h1>

          <TextEffect
            per="char"
            preset="fade"
            className="text-gray-400 mt-3 text-base"
          >
            Enter your email to continue your journey
          </TextEffect>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="email"
              className="text-sm text-gray-300 font-medium"
            >
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-4 rounded-md bg-[#0d1117] border border-[#30363d] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:ring-offset-2 focus:ring-offset-[#0f1117]"
            />
          </div>

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
            {loading ? "Sending Otp to your mail..." : "Send Verification Code"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
