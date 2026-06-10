// types/portone.d.ts
declare module "@portone/browser-sdk" {
  export interface PaymentParams {
    storeId: string;
    channelKey: string;
    paymentId: string;
    orderName: string;
    totalAmount: number;
    currency: string;
    payMethod: string;
    customer: {
      fullName: string;
    };
  }

  export interface PaymentResponse {
    code?: string;
    message?: string;
    paymentId?: string;
  }

  export function requestPayment(
    params: PaymentParams,
  ): Promise<PaymentResponse>;
}
