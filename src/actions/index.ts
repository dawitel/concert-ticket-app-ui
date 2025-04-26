"use server";

import type { APIErrorResponse, APISuccessResponse } from "@/types";

export async function verifyTicket(
  qrCodeData: string,
  invalidate: boolean = false,
): Promise<APISuccessResponse | APIErrorResponse> {
  try {
    const response = await fetch(
      "https://concert-ticket-app-api.onrender.com/api/tickets/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCodeData, invalidate }),
      },
    );

    const data = await response.json();
    return data as APISuccessResponse | APIErrorResponse;
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: "Network error",
        details: error.message,
        code: 500,
        hint: "Check your network connection and try again",
      },
    };
  }
}
