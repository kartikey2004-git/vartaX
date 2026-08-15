/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppData, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import ThemeToggle from "@/components/ThemeToggle";
import EditableNameField from "@/components/EditableNameField";

const Profilepage = () => {
  const { user, isAuth, loading, setUser } = useAppData();

  const router = useRouter();

  const saveName = async (name: string) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${user_service}/api/v1/user/update`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      Cookies.set("token", data.token, {
        expires: 15,
        secure: false,
        path: "/",
      });

      toast.success(data.message);
      setUser(data.user);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
      throw error;
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-2xl pt-4 sm:pt-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-md p-3 transition-colors"
              onClick={() => router.push("/chat")}
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Button>

            <div>
              <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
                Profile Settings
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account information
              </p>
            </div>
          </div>

          <ThemeToggle />
        </div>

        <Card className="overflow-hidden gap-0 p-0">
          <CardHeader className="flex items-center gap-5 border-b bg-secondary/40 p-6 sm:gap-6 sm:p-8">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <UserCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-card bg-success" />
            </div>

            <div className="flex-1">
              <h2 className="mb-1 text-xl text-foreground sm:text-2xl">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">Active now</p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 p-5 sm:p-6">
            <div>
              <Label className="text-foreground">Display Name</Label>
              <EditableNameField value={user?.name} onSave={saveName} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profilepage;
