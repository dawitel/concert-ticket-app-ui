export interface APIErrorResponse {
  success: false;
  error: {
    message: string;
    details: string;
    code: number;
    hint: string;
  };
}

export interface APISuccessResponse {
  success: true;
  message: string;
  data: {
    ticket_id: string;
    status: string;
    out_count: number;
    category: string;
  };
}
