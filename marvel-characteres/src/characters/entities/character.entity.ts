import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {Team} from '../../teams/entities/team.entity';

@Entity('characters')
export class Character {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 100 })
  real_name: string;
  @Column({ type: 'varchar', length: 100, unique: true })
  alias: string;
  @Column({ type: 'varchar', length: 150 })
  main_power: string;
  @Column({ type: 'int' })
  power_level: number;
  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  status: string;
  @Column({ type: 'boolean', default: false })
  is_villain: boolean;
  @Column({ type: 'int', nullable: true })
  team_id: number | null;
  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team | null;
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}