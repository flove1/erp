import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", "length": 255, unique: true })
  identifier: string; // email или телефон

  @Column({ type: "text" })
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
