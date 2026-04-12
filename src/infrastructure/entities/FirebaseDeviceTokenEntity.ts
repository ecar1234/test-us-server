import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./UserEntity.js";

@Entity('device_tokens')
export class FirebaseDeviceTokenEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    // FCM에서 발급받은 실제 기기 토큰 (길이가 매우 길 수 있으므로 넉넉하게 설정)
    @Column('varchar', { length: 255 })
    token!: string;

    // 토큰을 발급받은 기기의 종류 (예: 'android', 'ios', 'web')
    @Column({ type: 'varchar', length: 50, nullable: true })
    deviceType?: string;

    // 토큰이 생성되거나 업데이트된 시간
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;
    
    @Index()
    @ManyToOne(() => UserEntity, user => user.deviceTokens)
    @JoinColumn({ name: 'userId' })
    user!: UserEntity; // 사용자 엔티티와의 관계 설정 (선택 사항이지만 권장됨)
}