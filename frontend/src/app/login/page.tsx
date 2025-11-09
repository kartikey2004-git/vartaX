"use client";

import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { redirect, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useAppData, user_service } from "@/context/AppContext";
import Loading from "@/components/Loading";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter(); // useRouter for navigation inside our app

  // extract isAuth (to check authenticated user or not) and loading from useAppData hook which is built on top of Usecontext

  const { isAuth, loading: userLoading } = useAppData();

  const handleSubmit = async (
    e: React.FormEvent<HTMLElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    // Send a POST request to the backend to initiate the login process

    try {
      const { data } = await axios.post(`${user_service}/api/v1/login`, {
        email,
      });

      toast.success(data.message);

      // Redirect to the verify page with the email as a query parameter

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

  if (userLoading) return <Loading />;
  if (isAuth) return redirect("/chat");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#0f1117]">
      
      <div className="relative flex w-full items-center justify-center px-6 py-20 lg:w-3/5 lg:px-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-light leading-tight tracking-tighter md:text-5xl">
            <span className="text-white">VartaX</span> <br />
            <span className="font-normal text-gray-600">Always Connected</span>
          </h1>

          <p className="mb-6 inline-block rounded border border-gray-700 bg-black/50 px-4 py-2 text-sm text-gray-400 backdrop-blur-sm">
            Discover VartaX
          </p>

          <p className="max-w-md text-base leading-relaxed text-gray-300 md:text-lg mx-auto lg:mx-0">
            Chat with anyone in real time—messages deliver instantly, files
            share smoothly, and you always stay connected.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center bg-[#161b22]/90 px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div
            className="text-gray-400 mt-3 text-base text-center"
          >
            Enter your email to continue your journey
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm">Login with email</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
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
                className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-6 text-white placeholder-gray-500 outline-none transition-colors focus:ring-1 focus:ring-[#1f6feb] focus:ring-offset-[#0f1117]"
              />
            </div>

            <Button
              variant="default"
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#0f1117] hover:bg-[#1a1d25]"
              } text-white flex items-center justify-center gap-2`}
            >
              {loading
                ? "Sending Otp to your mail..."
                : "Send Verification Code"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
