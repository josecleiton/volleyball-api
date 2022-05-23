import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { TypeORMFilterService } from '../core/services/typeorm-filter.service';
import { EquipeService } from '../equipe/equipe.service';
import {
  CriaLigaDto,
  InicializaLigaDto,
  LigaRespostaDto,
} from './dto/liga.dto';
import { LigaRepository } from './liga.repository';

@Injectable({ scope: Scope.REQUEST })
export class LigaService {
  constructor(
    private readonly ligaRepository: LigaRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  async criaLiga(requisicao: CriaLigaDto) {
    const liga = this.ligaRepository.create(requisicao);

    try {
      return new LigaRespostaDto(await this.ligaRepository.save(liga));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Competição',
      });
    }
  }

  async iniciaLiga(requisicao: InicializaLigaDto) {
    const liga = await this.ligaRepository.pegaUmComEquipesCompletas(
      requisicao.id,
    );

    if (liga.iniciadaEm) {
      throw new ConflictException(
        `Liga ${liga.id} já iniciada na data: ${liga.iniciadaEm}`,
      );
    }

    if (!liga.equipes.every((equipe) => equipe.apta)) {
      await this.equipeService.atualizaAptidao(liga.equipes);
      throw new ConflictException('Todas as equipes precisam estar aptas');
    }

    liga.iniciadaEm = new Date();

    return new LigaRespostaDto(await this.ligaRepository.save(liga));
  }

  async excecaoSeALigaEstaIniciada(id: string) {
    const resultado = await this.ligaRepository.findOne({
      where: { id },
      select: ['id', 'iniciadaEm'],
    });
    if (resultado?.iniciadaEm) {
      return;
    }

    throw new ConflictException(`Liga ${id} já está iniciada.`);
  }

  async lista() {
    const list = await this.ligaRepository.find({
      order: { dataCriacao: 'DESC' },
    });
    return list.map((x) => new LigaRespostaDto(x));
  }

  private async devePegarEntidade(id: string, relations?: string[]) {
    const liga = await this.ligaRepository.findOne(id, { relations });
    if (!liga) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }

    return liga;
  }

  async deveEncontrarUm(id: string) {
    return new LigaRespostaDto(await this.devePegarEntidade(id));
  }

  async remove(id: string) {
    const resultado = await this.ligaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Liga ${id} não encontrada`);
    }
  }
}
