import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('purchase_event_logs')
export class PurchaseEventLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  eventType: string;

  @Column('varchar')
  appUserId: string;

  @Column('varchar')
  platform: string;

  @Column("json")
  payload: any;

  @CreateDateColumn()
  createdAt: Date;
}