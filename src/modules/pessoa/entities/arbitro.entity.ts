import { Entity } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga';

@Entity('arbitros')
export class Arbitro extends PessoaDeLiga {}
