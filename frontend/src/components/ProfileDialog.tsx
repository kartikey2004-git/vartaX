/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppData, user_service } from "@/context/AppContext";
import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut, Save, User, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProfileDialogProps {
  children: React.ReactNode;
}

const ProfileDialog = ({ children }: ProfileDialogProps) => {
  const { user, setUser, logoutUser } = useAppData();
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const editHandler = () => {
    setIsEdit(!isEdit);
    setName(user?.name || "");
  };

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const token = Cookies.get("token");
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setOpen(false);
    logoutUser();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            Manage your account information and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <UserCircle className="w-10 h-10 text-muted-foreground" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground">
                {user?.name || "User"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user?.email || "No email"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-foreground">Display Name</Label>

              {isEdit ? (
                <form onSubmit={submitHandler} className="mt-2 space-y-3">
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-10"
                      placeholder="Enter your name"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      size="sm"
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {isLoading ? "Saving..." : "Save"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={editHandler}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between mt-2 p-3 rounded-md border">
                  <span className="text-foreground">
                    {user?.name || "Not set"}
                  </span>
                  <Button variant="outline" size="sm" onClick={editHandler}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
