import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { Attachment } from "@/database/entities/attachment.entity";
import { RolesName } from "src/api/base";

@Entity({ name: "User" })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Unique(["email"])
  @Column()
  email: string;

  @Column()
  password: string;

  @Index()
  @Column({ default: RolesName.INVALID_USER })
  role: RolesName;

  @Column({ default: null })
  refreshToken: string;

  @Column({ default: null })
  confirmationToken: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(() => Attachment, (attachment) => attachment.user, {
    eager: false,
  })
  @JoinColumn({ name: "relationId" })
  attachments?: Attachment[];
}
