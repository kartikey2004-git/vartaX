/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppData, user_service } from "@/context/AppContext";
import React, { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import EditableNameField from "@/components/EditableNameField";
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
  const [open, setOpen] = useState(false);

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
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-background" />
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
              <EditableNameField
                value={user?.name}
                onSave={saveName}
                size="sm"
              />
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
