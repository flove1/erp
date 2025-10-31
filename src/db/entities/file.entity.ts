import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

export class FileMetadata {
  @Column({ type: "varchar", length: 255, nullable: true })
  extension?: string;

  @Column({ type: "varchar", length: 255 })
  filename: string;

  @Column({ type: "varchar", length: 255 })
  mimetype: string;

  @Column({ type: "bigint" })
  size: number;
}

@Entity({ name: "files" })
export class FileEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column(() => FileMetadata)
  metadata: FileMetadata;

  @CreateDateColumn()
  uploadedAt: Date;
}
