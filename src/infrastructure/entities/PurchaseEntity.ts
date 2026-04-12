import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

export enum PurchaseState{
    PURCHASED = 'purchased',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
    RENEW = 'renew',
    REFUND = 'refund',
}

@Entity('purchases')
export class PurchaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    plan: string;

    @Column()
    productId: string;

    @Column()
    store: string; // ios / android

    @Column()
    isActive: boolean;

    @Column()
    willRenew: boolean;

    @Column({ type: 'enum', enum: PurchaseState, default: PurchaseState.PURCHASED })
    state: PurchaseState;

    @Column({ nullable: true })
    expiresAt: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column()
    verificationData: string;

    @ManyToOne(() => UserEntity, user => user.purchases)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}