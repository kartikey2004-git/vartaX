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
    e: React.FormEvent<HTMLElement>,
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      <div className="relative flex w-full items-center justify-center px-6 py-20 lg:w-3/5 lg:px-16">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
          linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
        `,
            backgroundSize: "50px 50px",
          }}
        />
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-light leading-tight tracking-tighter md:text-5xl">
            <span className="text-foreground">VartaX</span> <br />
            <span className="font-normal text-muted-foreground">
              Always Connected
            </span>
          </h1>

          <p className="mb-6 inline-block rounded border border-border/50 bg-card/80 px-4 py-2 text-sm text-muted-foreground backdrop-blur-sm shadow-sm">
            Discover VartaX
          </p>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg mx-auto lg:mx-0">
            Chat with anyone in real time—messages deliver instantly, files
            share smoothly, and you always stay connected.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center bg-card/90 px-6 py-12 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-muted-foreground mt-3 text-base text-center">
            Enter your email to continue your journey
          </div>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-border/50"></div>
            <span className="px-4 text-muted-foreground text-sm">
              Login with email
            </span>
            <div className="flex-1 border-t border-border/50"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-foreground"
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
                className="w-full"
              />
            </div>

            <Button
              variant="default"
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded font-medium transition-colors flex items-center justify-center gap-2 ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary/95"
              }`}
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
