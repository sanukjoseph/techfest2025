"use client";

import React, { useState, useRef } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const QRGenerator: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code in PNG format
  const generateQRCode = async () => {
    if (!text.trim()) {
      setError("Please enter some text to generate a QR code.");
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        maskPattern: 6, // Use mask pattern 6 for better readability
        margin: 1,
        width: 168, // Set width instead of scale
        color: {
          dark: "#000000", // Black dots
          light: "#ffffff", // White background
        },
        errorCorrectionLevel: "H", // High error correction for better readability
      });
      setQrCodeUrl(url);
      setError(null);
    } catch (err) {
      setError("Failed to generate QR code. Please try again.");
      console.error(err);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl && canvasRef.current) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "qrcode.png";
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Input
              type="text"
              placeholder="Enter text or URL"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full max-w-md"
            />
            <Button onClick={generateQRCode}>Generate QR Code</Button>
            {error && <p className="text-red-500">{error}</p>}
            {qrCodeUrl && (
              <div className="flex flex-col items-center space-y-2">
                <canvas ref={canvasRef} style={{ display: "none" }} />
                <Image src={qrCodeUrl} alt="Generated QR Code" className="w-48 h-48" width={168} height={168} />
                <Button onClick={downloadQRCode}>Download QR Code</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRGenerator;
