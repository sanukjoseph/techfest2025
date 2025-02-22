"use server";

import { zfd } from "zod-form-data";
import crypto from "crypto";
import { ServeractionClient } from "@/lib/safe-action";

const fileUploadSchema = zfd.formData({
  file: zfd.file(),
});

export const uploadFileAction = ServeractionClient.schema(fileUploadSchema).action(
  async ({ parsedInput: { file }, ctx: { user, supabase } }) => {
    try {
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        return { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.", status: 400 };
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        return { error: "File size too large. Maximum size is 5MB.", status: 400 };
      }
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME as string;
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/events/${crypto.randomUUID().replace(/-/g, "")}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      });
      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: "Failed to upload file", status: 500 };
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      return { url: publicUrl };
    } catch (error) {
      console.error("Server error:", error);
      return { error: "Internal server error", status: 500 };
    }
  },
);
