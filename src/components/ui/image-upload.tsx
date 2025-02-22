/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ImageUploadProps {
  onChange: (imageUrl: string | null) => void;
  value: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(value);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cropCoordinates, setCropCoordinates] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null); // Clear any previous errors
    const file = acceptedFiles[0];

    if (!file) {
      setUploadError("No file selected.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSrc(reader.result as string);
      setIsOpen(true);
    };
    reader.onerror = () => {
      setUploadError("Failed to read file.");
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDrop,
  });

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const image = event.target as HTMLImageElement;
    imageRef.current = image;
  };

  const handleCropAreaChange = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const image = imageRef.current;
    const rect = image.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCropCoordinates({ x, y, width: 100, height: 100 }); // Initial crop area
  };

  const generateDownload = async () => {
    if (!src || !cropCoordinates) {
      setUploadError("Please select a crop area.");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      const image = new Image();
      image.src = src;
      await image.decode();

      canvas.width = cropCoordinates.width;
      canvas.height = cropCoordinates.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          image,
          cropCoordinates.x,
          cropCoordinates.y,
          cropCoordinates.width,
          cropCoordinates.height,
          0,
          0,
          cropCoordinates.width,
          cropCoordinates.height,
        );

        const base64Image = canvas.toDataURL("image/jpeg");
        setCroppedImageUrl(base64Image);
        onChange(base64Image);
        setIsOpen(false);
        setUploadError(null);
        toast.success("Image cropped and saved successfully!");
      } else {
        setUploadError("Could not get canvas context.");
        toast.error("Could not get canvas context.");
      }
    } catch (error) {
      console.error("Error generating cropped image:", error);
      setUploadError("Failed to generate cropped image.");
      toast.error("Failed to generate cropped image.");
    }
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setSrc(null); // Clear the source to free up memory
    setUploadError(null);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-dashed border-2 rounded-md p-4 cursor-pointer",
          "hover:bg-gray-100 dark:hover:bg-gray-700",
          croppedImageUrl ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900",
          isDragActive && "border-primary",
        )}
      >
        <input {...getInputProps()} />
        {croppedImageUrl ? (
          <img
            src={croppedImageUrl}
            alt="Uploaded Image"
            className="w-full h-32 object-cover rounded-md"
            onError={() => {
              setCroppedImageUrl(null);
              onChange(null);
            }}
          />
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Drag &apos;n&apos; drop some files here, or click to select files</p>
        )}
      </div>
      {uploadError && <p className="text-red-500 mt-1">{uploadError}</p>}

      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
            <DialogDescription>Click and drag on the image to select a crop area.</DialogDescription>
          </DialogHeader>
          {src && (
            <div onClick={handleCropAreaChange}>
              <img
                src={src}
                alt="Image to Crop"
                onLoad={handleImageLoad}
                style={{ maxWidth: "100%", maxHeight: "400px", userSelect: "none" }}
              />
              {cropCoordinates && (
                <div
                  style={{
                    position: "absolute",
                    left: cropCoordinates.x + "px",
                    top: cropCoordinates.y + "px",
                    width: cropCoordinates.width + "px",
                    height: cropCoordinates.height + "px",
                    border: "2px dashed #fff",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={handleDialogClose}>
              Cancel
            </Button>
            <Button type="button" onClick={generateDownload}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
