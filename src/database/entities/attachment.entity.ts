import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@/database/entities/user.entity";
import { Blob } from "@/database/entities/blob.entity";

@Entity({ name: "Attachment" })
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fieldName: string;

  @Column()
  relationId: number;

  @Column()
  relationType: string;

  @CreateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.attachments)
  @JoinColumn({ name: "relationId" })
  user?: User;

  @OneToOne(() => Blob)
  @JoinColumn()
  blob?: Blob;
}
