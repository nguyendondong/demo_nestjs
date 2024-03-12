import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "@/database/entities/user.entity";

@Entity({ name: "photos" })
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.photos)
  @JoinColumn({ name: "userId" })
  user?: User;
}
