"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

const QRScanner = () => {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState<number>(0);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean>(true);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);

  // Request camera access
  const requestCameraAccess = useCallback(async () => {
    try {
      if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately after permission is granted
      } else {
        setError("Camera access is not supported in this browser or environment.");
        setIsBrowserSupported(false);
      }
    } catch (err) {
      console.error("Error requesting camera access:", err);
      setError("Camera access was denied. Please enable camera permissions in your browser settings.");
      setHasCameraPermission(false);
    }
  }, []);

  // Handle devices
  const handleDevices = useCallback((mediaDevices: MediaDeviceInfo[]) => {
    const videoDevices = mediaDevices.filter(({ kind }) => kind === "videoinput");
    setDevices(videoDevices);
    if (videoDevices.length > 0) {
      setDeviceId(videoDevices[0].deviceId);
    }
  }, []);

  // Capture and process QR code
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              const email = code.data;
              if (email.includes("@")) {
                playSuccessSound();
                setIsCameraOn(false);
                router.push(`/verification?email=${encodeURIComponent(email)}`);
              } else {
                setError("Invalid QR code. Please try again.");
              }
            }
          }
        };
      }
    }
  }, [router]);

  // Switch between cameras
  const switchCamera = useCallback(() => {
    if (devices.length > 1) {
      const nextIndex = (currentDeviceIndex + 1) % devices.length;
      setCurrentDeviceIndex(nextIndex);
      setDeviceId(devices[nextIndex].deviceId);
    } else {
      setError("No other camera is detected.");
    }
  }, [currentDeviceIndex, devices]);

  // Enumerate devices and check for camera support
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(handleDevices)
        .catch((err) => {
          console.error("Error enumerating devices:", err);
          setError("Failed to access camera. Please ensure you have granted camera permissions.");
          setIsBrowserSupported(false);
        });
    } else {
      setError("Camera access is not supported in this browser or environment.");
      setIsBrowserSupported(false);
    }
  }, [handleDevices]);

  // Start capturing frames when the camera is turned on
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCameraOn && hasCameraPermission) {
      interval = setInterval(capture, 500);
    }
    return () => clearInterval(interval);
  }, [isCameraOn, capture, hasCameraPermission]);

  // Video constraints for the selected camera
  const videoConstraints = useMemo(() => ({ deviceId: deviceId ? { exact: deviceId } : undefined }), [deviceId]);

  // Play success sound
  const playSuccessSound = () => {
    const audio = new Audio("/audio/qrcode-success.mp3");
    audio.play();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader className="pb-0"></CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {isBrowserSupported ? (
              <>
                {!hasCameraPermission && <Button onClick={requestCameraAccess}>Allow Camera Access</Button>}

                {hasCameraPermission && (
                  <>
                    <Button onClick={() => setIsCameraOn((prev) => !prev)}>{isCameraOn ? "Turn off camera" : "Turn on Camera"}</Button>

                    {isCameraOn && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                        {devices.length > 1 && <Button onClick={switchCamera}>Change Camera</Button>}
                        <Webcam
                          audio={false}
                          ref={webcamRef}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          width="100%"
                          height="auto"
                          mirrored
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </motion.div>
                    )}
                  </>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>{error || "Your browser or environment does not support camera access."}</AlertDescription>
              </Alert>
            )}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QRScanner;
