

export interface ILatestReceiptInfo {
    product_id: string;
    original_transaction_id: string;
    expires_date_ms: string;
    purchase_date_ms: string;
    cancellation_date_ms: string;
}

export interface IPendingRenewalInfo {
    product_id: string;
    auto_renew_status: '0' | '1';
}

export interface IIosWebhookPayload {
    notificationType: string;
    subType?: string;
    data: {
        signedTransactionInfo?: string;
        signedRenewlInfo?: string;
    }
}