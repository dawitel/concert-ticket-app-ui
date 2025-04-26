"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ScannerProps {
  onScan: (data: string) => void;
  isScanning: boolean;
  isLoading: boolean;
}

export default function Scanner({
  onScan,
  isScanning,
  isLoading,
}: ScannerProps) {
  const webcamRef = useRef<Webcam>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const requestCameraPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream immediately
      setError(null);
      setPermissionDenied(false);
    } catch (err: any) {
      console.error("Camera permission error:", err);
      setError(
        "Camera access denied. Please allow camera permissions in your browser settings.",
      );
      setPermissionDenied(true);
    }
  }, []);

  const scanQRCode = useCallback(() => {
    if (!webcamRef.current || !isScanning || isLoading) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code && code.data) {
      onScan(code.data);
    }
  }, [isScanning, isLoading, onScan]);

  useEffect(() => {
    if (!isScanning || isLoading) return;

    // Request camera permission when scanning starts
    requestCameraPermission();

    const interval = setInterval(scanQRCode, 300); // Scan every 300ms
    return () => clearInterval(interval);
  }, [isScanning, isLoading, scanQRCode, requestCameraPermission]);

  return (
    <div
      className={`relative w-full max-w-md h-64 border-4 ${isLoading ? "border-muted opacity-50" : "border-primary"} rounded-lg overflow-hidden transition-all duration-300`}
    >
      {isScanning && !isLoading && !permissionDenied && (
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          className="w-full h-full object-cover"
          onUserMediaError={(err) => {
            console.error("Webcam error:", err);
            setError(
              "Camera access denied. Please allow camera permissions in your browser settings.",
            );
            setPermissionDenied(true);
          }}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted bg-opacity-50">
          <svg
            className="w-12 h-12 animate-spin text-primary"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/20 text-destructive p-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Camera Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          {permissionDenied && (
            <Button variant="outline" onClick={requestCameraPermission}>
              Retry Camera Access
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
