"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Scanner from "@/components/Scanner";
import { verifyTicket } from "@/actions";
import type { APIErrorResponse, APISuccessResponse } from "@/types";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [result, setResult] = useState<
    APISuccessResponse | APIErrorResponse | null
  >(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleScan = async (data: string) => {
    if (!data) return;
    setIsScanning(false);
    setIsLoading(true);

    const response = await verifyTicket(data, isInvalidating);
    setResult(response);
    setIsLoading(false);
    setIsInvalidating(false); // Reset invalidate mode after scan
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
      {/* Help Button in Top-Right Corner */}
      <div className="fixed top-4 right-4 z-10">
        <Button
          onClick={() => setIsSheetOpen(true)}
          disabled={isLoading}
          variant="outline"
          size="lg"
          className="flex items-center"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </div>

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
                    <p>Ticket ID: {result.data.ticket_id}</p>
                    <p>Category: {result.data.category}</p>
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="w-[90%] sm:w-[400px] overflow-y-auto py-2 px-4"
        >
          <SheetHeader>
            <SheetTitle>How to Use this Ticket QR Code Scanner</SheetTitle>
            <SheetDescription>
              Follow these steps to scan and validate the concert tickets.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold pt-6">Step 1: Start Scanning</h3>
              <p className="text-lg text-muted-foreground mt-2">
                Click the <strong>Scan</strong> button to activate the camera.
                Allow camera permissions if prompted.
              </p>
              <Image
                src="/step2.jpg"
                alt="Step 1: Start Scanning"
                className="mt-2 w-full rounded-md border"
                layout="responsive"
                width={300}
                height={200}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold pt-6">Step 2: Scan a QR Code</h3>
              <p className="text-lg text-muted-foreground mt-3">
                Point your camera at the QR code on the ticket. Ensure the QR
                code is well-lit and in focus.
              </p>
              <Image
                src="/step1.jpg"
                alt="Step 2: Scan QR Code"
                className="mt-2 w-full rounded-md border"
                layout="responsive"
                width={300}
                height={200}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold pt-6">Step 3: View Results</h3>
              <p className="text-lg text-muted-foreground mt-3">
                After scanning, view the result. A green alert shows ticket
                details (ID, Category, Status, Out Count). A red alert indicates
                an error.
              </p>
              <Image
                src="/step3.jpg"
                alt="Step 3: View Results"
                className="mt-2 w-full rounded-md border"
                layout="responsive"
                width={300}
                height={200}
              />
            </div>
            <div>
              <h3 className="text-lg font-bold pt-6">
                Step 4: Invalidate a Ticket
              </h3>
              <p className="text-lg text-muted-foreground mt-3">
                To fully invalidate a ticket, click <strong>Invalidate</strong>,
                then scan the QR code. The ticket status will change to{" "}
                <em>used</em>.
              </p>
              <Image
                src="/step4.jpg"
                alt="Step 4: Invalidate Ticket"
                className="mt-2 w-full rounded-md border"
                layout="responsive"
                width={300}
                height={200}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
