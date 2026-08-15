"use client";

import { useState, type FormEvent } from "react";
import { Save, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EditableNameFieldProps {
  value?: string;
  onSave: (name: string) => Promise<void>;
  size?: "default" | "sm";
}

export default function EditableNameField({
  value,
  onSave,
  size = "default",
}: EditableNameFieldProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(value ?? "");
  const [isLoading, setIsLoading] = useState(false);

  const startEdit = () => {
    setName(value ?? "");
    setIsEdit(true);
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(name);
      setIsEdit(false);
    } catch {
      // error is already surfaced by the caller's onSave; keep the form open
    } finally {
      setIsLoading(false);
    }
  };

  if (isEdit) {
    return (
      <form onSubmit={submitHandler} className="mt-2 space-y-3">
        <div className="relative">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pr-10"
            placeholder="Enter your name"
          />
          <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="submit"
            size={size}
            loading={isLoading}
            className="gap-2"
          >
            {!isLoading && <Save className="h-4 w-4" />}
            {isLoading ? "Saving..." : "Save"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size={size}
            onClick={() => setIsEdit(false)}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="mt-2 flex items-center justify-between rounded-md border bg-card p-3">
      <span className="text-foreground">{value || "Not set"}</span>
      <Button variant="outline" size={size} onClick={startEdit}>
        Edit
      </Button>
    </div>
  );
}
