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
        }
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
    <div className="min-h-screen bg-[#0f1117] p-6">
      <div className="max-w-2xl mx-auto pt-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Button
            className="p-3 bg-[#1a1d25] hover:bg-[#272a33] rounded-lg text-white border border-gray-800 transition-colors"
            onClick={() => router.push("/chat")}
          >
            <ArrowLeft className="w-5 h-5 text-gray-300" />
          </Button>

          <div>
            <h1 className="text-3xl font-semibold text-white">
              Profile Settings
            </h1>
            <p className="text-gray-400 mt-1 text-sm">
              Manage your account information
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-[#1a1d25] rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="bg-[#16181f] p-8 border-b border-gray-600 flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center">
                <UserCircle className="w-12 h-12 text-gray-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1a1d25]" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl  text-white mb-1">
                {user?.name || "User"}
              </h2>
              <p className="text-gray-400 text-sm">Active now</p>
            </div>
          </div>

          {/* Settings Section */}
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-gray-300">Display Name</Label>

              {isEdit ? (
                <form onSubmit={submitHandler} className="mt-2 space-y-3">
                  {/* Input with icon */}
                  <div className="relative">
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pr-10 bg-[#1a1d25] text-white border border-gray-700 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                    <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>

                    <Button
                      type="button"
                      onClick={editHandler}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between mt-2 bg-[#1a1d25] p-3 rounded-lg border border-gray-700">
                  <span className="text-white">{user?.name || "Not set"}</span>
                  <Button
                    onClick={editHandler}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
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
