
export class PurchaseModel {
    constructor(
       props: {
        id?: number | null,
        plan: string,
        productId: string,
        store: string,
        isActive: boolean,
        willRenew: boolean,
        state: string,
        expiresAt: Date,
        createdAt?: Date,
        updatedAt?: Date,
        userId: string
    }
    ) {
        this.id = props.id;
        this.plan = props.plan;
        this.productId = props.productId;
        this.store = props.store;
        this.isActive = props.isActive;
        this.willRenew = props.willRenew;
        this.state = props.state;
        this.expiresAt = props.expiresAt;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.userId = props.userId;
    }

    id: number | null;
    plan: string;
    productId: string;
    store: string;
    isActive: boolean;
    willRenew: boolean;
    state: string;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date;
    userId: string;
}