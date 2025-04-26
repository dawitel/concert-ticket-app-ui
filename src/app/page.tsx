"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import type { APIErrorResponse, APISuccessResponse } from "@/types";
import { verifyTicket } from "@/actions";
import Scanner from "@/components/Scanner";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [result, setResult] = useState<
    APISuccessResponse | APIErrorResponse | null
  >(null);

  const handleScan = async (data: string) => {
    if (!data) return;
    setIsScanning(false);
    setIsLoading(true);

    const response = await verifyTicket(data, isInvalidating);
    setResult(response);
    setIsLoading(false);
    setIsInvalidating(false);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    setResult(null);
  };

  const handleInvalidate = () => {
    setIsScanning(true);
    setIsInvalidating(true);
    setResult(null);
  };

  const handleReset = () => {
    setIsScanning(false);
    setIsInvalidating(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card
        className={`w-full max-w-md ${result?.success === false ? "border-destructive" : "border-border"} shadow-lg`}
      >
        <CardContent className="p-6">
          <Scanner
            onScan={handleScan}
            isScanning={isScanning}
            isLoading={isLoading}
          />
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              onClick={isScanning ? handleReset : handleStartScan}
              disabled={isLoading || isInvalidating}
              variant={isScanning ? "destructive" : "default"}
              size="lg"
              className="w-full max-w-[150px]"
            >
              {isScanning ? "Reset" : "Scan"}
            </Button>
            <Button
              onClick={handleInvalidate}
              disabled={isLoading || isScanning}
              variant="secondary"
              size="lg"
              className="w-full max-w-[150px]"
            >
              Invalidate
            </Button>
          </div>
          {result && (
            <div className="mt-6">
              {result.success ? (
                <Alert
                  variant="default"
                  className="border-green-500 bg-green-50 text-green-800"
                >
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>{result.message}</AlertTitle>
                  <AlertDescription>
                    <p>Category: {result.data.category}</p>
                    <p>Ticket ID: {result.data.ticket_id}</p>
                    <p>Status: {result.data.status}</p>
                    <p>Out Count: {result.data.out_count}</p>
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{result.error.message}</AlertTitle>
                  <AlertDescription>
                    <p>{result.error.details}</p>
                    <p>{result.error.hint}</p>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
