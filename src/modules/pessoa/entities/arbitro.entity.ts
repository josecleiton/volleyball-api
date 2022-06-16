import { Entity } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga.entity';

@Entity('arbitros')
export class Arbitro extends PessoaDeLiga {}
