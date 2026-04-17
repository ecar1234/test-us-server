import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Table, TableInheritance, UpdateDateColumn } from "typeorm";
import { UserEntity } from "../UserEntity.js";

export enum PurchaseState{
    PURCHASED = 'purchased',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
    RENEW = 'renew',
    REFUND = 'refund',
}

@Entity('purchases')
@TableInheritance({column: {type: 'varchar', name: 'store'}})
export abstract class PurchaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('varchar')
    plan: string;

    @Column('varchar')
    productId: string;

    @Column('varchar')
    store: string; // ios / android

    @Column('boolean')
    isActive: boolean;

    @Column('boolean')
    willRenew: boolean;

    @Column({ type: 'enum', enum: PurchaseState, default: PurchaseState.PURCHASED })
    state: PurchaseState;

    @Column('timestamp', { nullable: true })
    expiresAt: Date;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // @Column()
    // verificationData: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;
}