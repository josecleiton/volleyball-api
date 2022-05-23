import { Entity } from 'typeorm';
import { PessoaDeLiga } from './pessoa_de_liga';

@Entity('delegados')
export class Delegado extends PessoaDeLiga {}
