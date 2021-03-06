import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TypeORMFilterService } from 'src/modules/core/services/typeorm-filter.service';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { EquipeService } from 'src/modules/equipe/equipe.service';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { FindOptionsRelations } from 'typeorm';
import {
  AtletaComEquipeRespostaDto,
  AtletaRespostaDto,
  AtualizaAtletaDto,
  CriaAtletaDto,
  DeveListarAtletasDto,
  IValidaNumeroEquipeDto,
  ListaAtletaDto,
} from '../dto/atleta.dto';
import { Atleta } from '../entities/atleta.entity';
import { TipoPessoa } from '../enums';
import { dtoParaPessoa } from '../mapper';
import { AtletaRepository } from '../repositories/atleta.repository';

@Injectable()
export class AtletaService {
  constructor(
    private readonly atletaRepository: AtletaRepository,
    private readonly equipeService: EquipeService,
    private readonly typeormFilterService: TypeORMFilterService,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
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
    const equipe = await this.equipeService.deveEncontrarSimplificada(
      requisicao.idEquipe,
    );
    await this.ligaService.excecaoSeALigaEstaIniciada(equipe.idLiga);

    if (equipe.quantidadeAtletas + 1 > Equipe.quantidadeMaximaDeAtletas) {
      throw new ConflictException(
        `Não é possível adicionar atleta, ele irá exceder o máximo de atletas por equipe que é ${Equipe.quantidadeMaximaDeAtletas}`,
      );
    }

    await this.validaNumeroEquipe({ equipe, numero: requisicao.numero });

    const atleta = this.atletaRepository.create({
      ...requisicao,
      equipe,
      pessoa: dtoParaPessoa(requisicao, TipoPessoa.atleta),
    });

    try {
      return new AtletaRespostaDto(await this.atletaRepository.save(atleta));
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Atleta',
      });
    }
  }

  private async deveEncontrarEntidade(
    id: string,
    relacoes: FindOptionsRelations<Atleta> = {},
  ) {
    const atleta = await this.atletaRepository.findOne({
      where: { id },
      relations: { ...relacoes, pessoa: true },
    });
    if (!atleta) {
      throw new NotFoundException(`Atleta ${id} não encontrado`);
    }

    return atleta;
  }

  async deveEncontrar(id: string) {
    return new AtletaRespostaDto(await this.deveEncontrarEntidade(id));
  }

  async deveEncontrarComEquipe(id: string) {
    return new AtletaComEquipeRespostaDto(
      await this.deveEncontrarEntidade(id, { equipe: true }),
    );
  }

  async listaAtletas(requisicao: ListaAtletaDto) {
    const atletas = await this.atletaRepository.listaAtletas(requisicao);

    return atletas.map((x) => new AtletaRespostaDto(x));
  }

  async deveListarAtletasEstritamente(requisicao: DeveListarAtletasDto) {
    const atletas = await this.listaAtletas(requisicao);

    const setIdReq = new Set(requisicao.ids);
    const naoEncontrados = atletas.filter((x) => !setIdReq.has(x.id));

    if (setIdReq.size !== atletas.length || naoEncontrados?.length) {
      throw new NotFoundException(`Atletas ${naoEncontrados}`);
    }

    return atletas;
  }

  async atualizaAtleta(id: string, requisicao: AtualizaAtletaDto) {
    try {
      const atleta = await this.deveEncontrarEntidade(id, { equipe: true });
      await this.ligaService.excecaoSeALigaEstaIniciada(atleta.equipe.idLiga);

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

      return new AtletaRespostaDto(await this.atletaRepository.save(atleta));
    } catch (error) {
      throw this.typeormFilterService.catch({
        error,
        description: 'conflito',
        entityName: 'Atleta',
      });
    }
  }

  async removerAtleta(id: string) {
    const atleta = await this.deveEncontrarComEquipe(id);
    await this.ligaService.excecaoSeALigaEstaIniciada(atleta.equipe.idLiga);

    await this.atletaRepository.delete(id);
  }
}
