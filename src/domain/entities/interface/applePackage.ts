import { ILatestReceiptInfo, IPendingRenewalInfo } from "./appleTypes.js";


export interface IResIosVerifyReceipt {
    status: number;
    leatest_receipt_info?: ILatestReceiptInfo[];
    pending_renewal_info?: IPendingRenewalInfo[];
}