import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity('purchase_event_logs')
export class PurchaseEventLogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  eventType: string;

  @Column()
  appUserId: string;

  @Column()
  platform: string;

  @Column("json")
  payload: any;

  @CreateDateColumn()
  createdAt: Date;
}