/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAppData, user_service } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, User, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Profilepage = () => {
  const { user, isAuth, loading, setUser } = useAppData();

  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string | undefined>("");

  const router = useRouter();

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name);
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
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
      setIsEdit(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuth && !loading) {
      router.push("/login");
    }
  }, [isAuth, loading, router]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex items-center gap-4 mb-10">
          <Button
            className="p-3 bg-secondary hover:bg-secondary/80 rounded-md text-foreground border border-border/50 transition-colors"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>

          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Profile Settings
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        <div className="bg-card rounded-md border border-border/50 shadow-sm overflow-hidden">
          <div className="bg-secondary/50 p-8 border-b border-border/50 flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-card" />
            </div>

            <div className="flex-1">
              <h2 className="text-2xl text-foreground mb-1">
                {user?.name || "User"}
              </h2>
              <p className="text-muted-foreground text-sm">Active now</p>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <Label className="text-foreground">Display Name</Label>

              {isEdit ? (
                <form onSubmit={submitHandler} className="mt-2 space-y-3">
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-10 bg-card text-foreground border border-border/50 rounded-md focus:border-primary focus:ring-primary/50"
                      placeholder="Enter your name"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      className="flex items-center gap-2 bg-primary hover:bg-primary/95 text-primary-foreground px-4 py-2 rounded-md transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      onClick={editHandler}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between mt-2 bg-card p-3 rounded-md border border-border/50">
                  <span className="text-foreground">
                    {user?.name || "Not set"}
                  </span>
                  <Button
                    onClick={editHandler}
                    className="px-3 py-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilepage;
