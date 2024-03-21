import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "Blob" })
export class Blob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileType: string;

  @Column()
  fileName: string;

  @Column()
  url: string;
}
