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
import ThemeToggle from "@/components/ThemeToggle";

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
    <div className="min-h-screen bg-background">
      <div className="fixed right-4 top-4 z-40">
        <ThemeToggle />
      </div>

      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="relative flex w-full items-center justify-center px-6 py-20 lg:w-3/5 lg:px-16">
          <div className="absolute inset-0 bg-secondary/30" />
          <div
            className="absolute inset-0 opacity-70 dark:opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <h1 className="mb-6 text-4xl font-light leading-tight tracking-tight text-foreground md:text-5xl">
              <span className="font-normal">VartaX</span>
              <br />
              <span className="font-normal">Always Connected</span>
            </h1>

            <p className="mb-6 inline-block rounded-md border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
              Discover VartaX
            </p>

            <p className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground lg:mx-0 lg:text-lg">
              Chat with anyone in real time—messages deliver instantly, files
              share smoothly, and you always stay connected.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-2/5 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mt-1 text-center text-sm text-muted-foreground sm:text-base">
              Enter your email to continue your journey
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t"></div>
              <span className="px-4 text-sm text-muted-foreground">
                Login with email
              </span>
              <div className="flex-1 border-t"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-foreground"
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
                className={`flex w-full items-center justify-center gap-2 rounded-md py-3 font-medium transition-colors ${
                  loading
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-primary/95"
                }`}
              >
                {loading
                  ? "Sending Otp to your mail..."
                  : "Send Verification Code"}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
