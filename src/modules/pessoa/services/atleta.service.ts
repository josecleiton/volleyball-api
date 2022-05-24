import {
  ConflictException,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EquipeService } from 'src/modules/equipe/equipe.service';
import {
  AtletaRespostaDto,
  AtualizaAtletaDto,
  CriaAtletaDto,
  IValidaNumeroEquipeDto,
  ListaAtletaDto,
} from '../dto/atleta.dto';
import { AtletaRepository } from '../repositories/atleta.repository';

@Injectable({ scope: Scope.REQUEST })
export class AtletaService {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
  ) {}

  private async validaNumeroEquipe({ numero, equipe }: IValidaNumeroEquipeDto) {
    if (
      await this.atletaRepository.count({
        where: { numero, idEquipe: equipe.id },
      })
    ) {
      throw new ConflictException(
        `Já existe um atleta com numero ${numero} na equipe ${equipe.nome}`,
      );
    }
  }

  async criaAtleta(requisicao: CriaAtletaDto) {
    const equipe = await this.equipeService.deveEncontrarUm(
      requisicao.idEquipe,
    );

    if (equipe.quantidadeAtletas + 1 > Equipe.quantidadeMaximaDeAtletas) {
      throw new ConflictException(
        `Não é possível adicionar atleta, ele irá exceder o máximo de atletas por equipe que é ${Equipe.quantidadeMaximaDeAtletas}`,
      );
    }

    await this.validaNumeroEquipe({ equipe, numero: requisicao.numero });

    const atleta = this.atletaRepository.create({
      ...requisicao,
      idEquipe: equipe.id,
      pessoa: requisicao.paraPessoa(),
    });

    try {
      return new AtletaRespostaDto(await this.atletaRepository.save(atleta));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Atleta',
      });
    }
  }

  private async deveEncontrarEntidade(id: string) {
    const atleta = await this.atletaRepository.findOne({
      where: { id },
    });
    if (!atleta) {
      throw new NotFoundException(`Atleta ${id} não encontrado`);
    }

    return atleta;
  }

  async deveEncontrarUm(id: string) {
    return new AtletaRespostaDto(await this.deveEncontrarEntidade(id));
  }

  async listaAtletas(requisicao: ListaAtletaDto) {
    const list = await this.atletaRepository.find({
      where: requisicao,
    });

    return list.map((x) => new AtletaRespostaDto(x));
  }

  async atualizaAtleta(id: string, requisicao: AtualizaAtletaDto) {
    try {
      const atleta = await this.deveEncontrarEntidade(id);

      if (requisicao.dataNascimento) {
        atleta.pessoa.dataNascimento = requisicao.dataNascimento;
      }

      if (requisicao.nome) {
        atleta.pessoa.nome = requisicao.nome;
      }

      if (requisicao.numero) {
        await this.validaNumeroEquipe({
          numero: requisicao.numero,
          equipe: atleta.equipe,
        });
        atleta.numero = requisicao.numero;
      }

      if (requisicao.posicao) {
        atleta.posicao = requisicao.posicao;
      }

      return new AtletaRespostaDto(await this.atletaRepository.save(atleta));
    } catch (error) {
      this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Atleta',
      });
    }
  }

  async removerAtleta(id: string) {
    // TODO: checa liga já iniciada
    const resultado = await this.atletaRepository.delete(id);
    if (!resultado.affected) {
      throw new NotFoundException(`Atleta ${id} não encontrado`);
    }
  }
}
