import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "tokens" })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  token: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column({ type: "boolean", default: false })
  isRevoked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  expiresAt: Date;
}
