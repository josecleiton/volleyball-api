/* eslint-disable no-empty */
import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { groupBy } from 'lodash';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaRespostaDto } from 'src/modules/pessoa/dto/atleta.dto';
import { PontuacaoViewRepository } from 'src/modules/pontuacao/repositories/pontuacao-view.repository';
import { RegistraDesistenciaService } from 'src/modules/pontuacao/services/registra-desistencia.service';
import { Connection } from 'typeorm';
import { Posicao, TipoArbitro } from '../../pessoa/enums';
import { ArbitroService } from '../../pessoa/services/arbitro.service';
import { AtletaService } from '../../pessoa/services/atleta.service';
import { DelegadoService } from '../../pessoa/services/delegado.service';
import { CadastrarResultadoPartidaDto, CadastrarResultadoPartidaRespostaDTO } from '../dto/partida-cadastro-resultado.dto';

import {
  AtletaParticipacaoDto,
  CadastrarParticipantesPartidaDto,
  ListaPartidasDto,
  PartidaRespostaDto,
  RemarcarPartidaDto,
} from '../dto/partida.dto';
import { Partida } from '../entities/partida.entity';
import { PontosPartida } from '../enums/pontos-partida.enum';
import { StatusPartida } from '../enums/status-partida.enum';
import { IPontoNoSet } from '../interfaces/ponto_no_set.interface';
import {
  ArbitroPartidaRepository,
  AtletaEscaladoRepository,
  EquipePartidaRepository,
  PartidaRepository,
} from '../repositories';

@Injectable()
export class PartidaService {
  constructor(
    private readonly partidaRepository: PartidaRepository,
    private readonly atletaEscaladoRepository: AtletaEscaladoRepository,
    private readonly arbitroPartidaRepository: ArbitroPartidaRepository,
    private readonly delegadoService: DelegadoService,
    private readonly atletaService: AtletaService,
    private readonly arbitroService: ArbitroService,
    private readonly registraDesistenciaService: RegistraDesistenciaService,
    @Inject(forwardRef(() => LigaService))
    private readonly ligaService: LigaService,
    private readonly connection: Connection,
    private readonly equipesPartidaRepository: EquipePartidaRepository,
    private readonly pontuacaoViewRepositor: PontuacaoViewRepository,
  ) { }

  async listaPartidasOrdenadas(
    requisicao: ListaPartidasDto,
  ): Promise<PartidaRespostaDto[]> {
    const partidas = await this.partidaRepository.listaPartidasOrdenadas(
      requisicao,
    );

    return partidas
      .slice(0, requisicao.limite ?? partidas.length)
      .map((x) => new PartidaRespostaDto(x));
  }

  async encontraPartida(id: string) {
    const partida = await this.deveEncontrarEntidade(id);

    return new PartidaRespostaDto(partida);
  }

  async remarcarPartida(id: string, requisicao: RemarcarPartidaDto) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.finalizada) {
      throw new ConflictException(
        `Partida ${id} se encontra finalizada. Status da partida: ${partida.status}`,
      );
    }

    const liga = await this.ligaService.deveEncontrarLigaIniciada(
      partida.mandante.equipe.idLiga,
    );
    if (requisicao.data < liga.dataComeco) {
      throw new ConflictException(
        `Nova data da partida deve ser maior que a data de início da liga ${liga.id}`,
      );
    }

    await this.partidaRepository.update(partida.id, {
      dataComeco: requisicao.data,
    });

    partida.dataComeco = requisicao.data;

    return new PartidaRespostaDto(partida);
  }

  async cadastrarParticipantes(
    id: string,
    requisicao: CadastrarParticipantesPartidaDto,
  ) {
    const partida = await this.deveEncontrarEntidade(id);
    if (partida.status !== StatusPartida.AGENDADA) {
      throw new ConflictException(
        `Partida ${id} não está no status ${StatusPartida.AGENDADA}`,
      );
    }

    const delegado = await this.delegadoService.deveEncontrarUm(
      requisicao.idDelegado,
    );

    if (requisicao.desistente) {
      return this.registraDesistenciaService
        .executar({
          partida,
          desistente: requisicao.desistente,
        })
        .then((resultado) => new PartidaRespostaDto(resultado.partida));
    }

    const arbitrosPorTipo = groupBy(
      requisicao.arbitros,
      (arbitro) => arbitro.tipo,
    );

    if (
      arbitrosPorTipo[TipoArbitro.PRINCIPAL]?.length !==
      Partida.máximoDeÁrbitrosPrimários
    ) {
      throw new UnprocessableEntityException(
        'É necessário apenas um árbitro principal',
      );
    }

    const quantidadeDeArbitrosSecundários =
      arbitrosPorTipo[TipoArbitro.SECUNDÁRIO]?.length;
    if (
      quantidadeDeArbitrosSecundários &&
      quantidadeDeArbitrosSecundários > Partida.máximoDeÁrbitrosSecundários
    ) {
      throw new UnprocessableEntityException(
        `É necessário apenas ${Partida.máximoDeÁrbitrosSecundários} árbitro secundário`,
      );
    }

    const quantidadeDeJuízesDeQuadra =
      arbitrosPorTipo[TipoArbitro.QUADRA]?.length;
    if (
      quantidadeDeJuízesDeQuadra &&
      quantidadeDeJuízesDeQuadra > Partida.máximoDeJuízesDeQuadra
    ) {
      throw new UnprocessableEntityException(
        `É necessário até ${Partida.máximoDeJuízesDeQuadra} juízes de quadra`,
      );
    }

    await this.arbitroService.deveListarEstritatemente(
      requisicao.arbitros.map((x) => x.idArbitro),
    );

    await Promise.all([
      this.validaAtletas(partida.mandante.idEquipe, requisicao.atletasMandante),
      this.validaAtletas(
        partida.visitante.idEquipe,
        requisicao.atletasVisitante,
      ),
    ]);

    const escalacaoMandante = requisicao.atletasMandante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({
        ...atletaDto,
        idEquipePartida: partida.idMandante,
      }),
    );
    const escalacaoVisitante = requisicao.atletasVisitante.map((atletaDto) =>
      this.atletaEscaladoRepository.create({
        ...atletaDto,
        idEquipePartida: partida.idVisitante,
      }),
    );
    const arbitrosDaPartida = requisicao.arbitros.map((arbitroDto) =>
      this.arbitroPartidaRepository.create({
        ...arbitroDto,
        idPartida: partida.id,
      }),
    );

    partida.status = StatusPartida.PARTICIPANTES_CADASTRADOS;
    partida.idDelegado = delegado.id;

    const partidaAtualizada = await this.connection.transaction(
      async (manager) => {
        const partidaSalva = await manager.save(partida);

        partidaSalva.mandante.atletas = await manager.save(escalacaoMandante);
        partidaSalva.visitante.atletas = await manager.save(escalacaoVisitante);
        partidaSalva.arbitros = await manager.save(arbitrosDaPartida);

        return partidaSalva;
      },
    );

    return new PartidaRespostaDto(partidaAtualizada);
  }

  private async deveEncontrarEntidade(id: string) {
    const partida = await this.partidaRepository.encontraPartidaCompleta(id);
    if (!partida) {
      throw new NotFoundException(`Partida ${id} não encontrada`);
    }

    return partida;
  }

  private validaAtletas(
    idEquipe: string,
    atletas: AtletaParticipacaoDto[],
  ): Promise<AtletaRespostaDto[]> | never {
    const atletasPorPosicao = groupBy(atletas, (a) => a.posicao);
    const quantidadeDeLiberos: number | undefined =
      atletasPorPosicao[Posicao.LIBERO]?.length;

    const quantidadeDeLiberosEhValida =
      quantidadeDeLiberos <= Partida.máximoDeLíberos;

    if (
      atletas.length === Partida.mínimoDeAtletasNaPartida &&
      quantidadeDeLiberos &&
      !quantidadeDeLiberosEhValida
    ) {
      throw new UnprocessableEntityException(
        `Equipe ${idEquipe} com o mínimo de atletas relacionados, não pode haver mais que ${Partida.máximoDeLíberos} líberos. PS: nesse caso nenhum líbero pode ser escalado também`,
      );
    }

    if (
      atletas.length > Partida.mínimoDeAtletasNaPartida &&
      !quantidadeDeLiberosEhValida
    ) {
      throw new UnprocessableEntityException(
        `Em uma equipe ${idEquipe} com ${atletas.length} tem que ter ao menos 1 líbero e não pode ter mais do que ${Partida.máximoDeLíberos}. Recebido: ${quantidadeDeLiberos}`,
      );
    }

    return this.atletaService.deveListarAtletasEstritamente({
      ids: atletas.map((x) => x.idAtleta),
      idEquipe,
    });
  }

  async cadastrarResultado(
    id: string,
    requisicao: CadastrarResultadoPartidaDto,
  ): Promise<CadastrarResultadoPartidaRespostaDTO> {

    const { equipeA, equipeB } = requisicao;



    const partida = await this.partidaRepository.findOne({ where: { id } })

    if (!partida) {
      throw new UnprocessableEntityException(
        `Não existe partida cadastrada com id: ${id}`,
      );
    }

    if (
      partida?.status !== StatusPartida.PARTICIPANTES_CADASTRADOS
    ) {
      throw new UnprocessableEntityException(
        `A partida precisa está com status : '${StatusPartida.PARTICIPANTES_CADASTRADOS}' para cadastrar um resultado`,
      );
    }

    if (
      equipeA.wo === true && equipeB.wo === true
    ) {

      throw new UnprocessableEntityException(
        `WO pode ser atribuido em apenas um equipe`,
      );
    }

    if (
      equipeA.pontos_nos_sets.length !== equipeB.pontos_nos_sets.length
    ) {

      throw new UnprocessableEntityException(
        `O array de pontos_nos_sets precisa ter o mesmo tamanho `,
      );
    }


    const equipePartidaA = await this.equipesPartidaRepository.findOne({
      where: {
        idEquipe: equipeA.idEquipe
      }
    })

    if (!equipePartidaA) {
      throw new UnprocessableEntityException(
        `Não existe equipe cadastrada com id: ${equipeA.idEquipe}, referente a equipeA `,
      );
    }

    const equipePartidaB = await this.equipesPartidaRepository.findOne({
      where: {
        idEquipe: equipeB.idEquipe
      }
    })

    if (!equipePartidaB) {
      throw new UnprocessableEntityException(
        `Não existe equipe cadastrada com id: ${equipeB.idEquipe}, referente a equipeB `,
      );
    }

    let pontuacaoEquipeA = 0;
    let pontuacaoEquipeB = 0;
    let setsganhosA = 0;
    let setsganhosB = 0;


    // verificar WO 
    if (equipeA.wo === true) {
      pontuacaoEquipeA = PontosPartida.WO;
      pontuacaoEquipeB = PontosPartida.VITORIAPERFEITA;
      equipePartidaA.pontuacao = pontuacaoEquipeA;
      equipePartidaB.pontuacao = pontuacaoEquipeB;

      await this.equipesPartidaRepository.save(equipePartidaA);
      await this.equipesPartidaRepository.save(equipePartidaB);

      partida.idGanhadora = equipePartidaB.id
      partida.status = StatusPartida.CONCLUIDA;
      await this.partidaRepository.save(partida);

      await this.pontuacaoViewRepositor.refreshMaterializedView();

      return new CadastrarResultadoPartidaRespostaDTO(equipePartidaA, equipePartidaB)

    }

    if (equipeB.wo === true) {
      pontuacaoEquipeB = PontosPartida.WO;
      pontuacaoEquipeA = PontosPartida.VITORIAPERFEITA;
      equipePartidaA.pontuacao = pontuacaoEquipeA;
      equipePartidaB.pontuacao = pontuacaoEquipeB;

      await this.equipesPartidaRepository.save(equipePartidaA);
      await this.equipesPartidaRepository.save(equipePartidaB);

      partida.idGanhadora = equipePartidaA.id
      partida.status = StatusPartida.CONCLUIDA;
      await this.partidaRepository.save(partida);

      await this.pontuacaoViewRepositor.refreshMaterializedView();

      return new CadastrarResultadoPartidaRespostaDTO(equipePartidaA, equipePartidaB)

    }

    const pontoNoSetA: IPontoNoSet[] = []
    const pontoNoSetB: IPontoNoSet[] = []

    const sets_disputados = equipeA.pontos_nos_sets.length
    // verificar  sets ganhos 
    for (let i = 0; i < sets_disputados; i++) {
      equipeA.pontos_nos_sets[i] > equipeB.pontos_nos_sets[i] ? setsganhosA += 1 : setsganhosB += 1;
      pontoNoSetA.push({ quantidade: equipeA.pontos_nos_sets[i] })
      pontoNoSetB.push({ quantidade: equipeB.pontos_nos_sets[i] })
    }



    if (
      (setsganhosA !== 3 && setsganhosB !== 3) || (setsganhosA > 3 && setsganhosB > 3)
    ) {

      throw new UnprocessableEntityException(
        ` Para haver ganhador precisa ter pelo menos uma equipe com 3 sets vencidos
        além de não poder ter um equipe com mais de 3 sets ganhos`,
      );
    }


    if (setsganhosA === 3 && (setsganhosB === 0 || setsganhosB === 1)) {
      pontuacaoEquipeA = PontosPartida.VITORIAPERFEITA;
      pontuacaoEquipeB = PontosPartida.DERROTAFEIA;
    }

    if (setsganhosB === 3 && (setsganhosA === 0 || setsganhosA === 1)) {
      pontuacaoEquipeB = PontosPartida.VITORIAPERFEITA;
      pontuacaoEquipeA = PontosPartida.DERROTAFEIA;
    }

    if (setsganhosA === 3 && setsganhosB === 2) {
      pontuacaoEquipeA = PontosPartida.VITORIASIMPLES;
      pontuacaoEquipeB = PontosPartida.DERROTASIMPLES
    }

    if (setsganhosB === 3 && setsganhosA === 2) {
      pontuacaoEquipeB = PontosPartida.VITORIASIMPLES;
      pontuacaoEquipeA = PontosPartida.DERROTASIMPLES;
    }

    // verificar vencedor 
    let ganhouA = false
    let ganhouB = false

    setsganhosA > setsganhosB ? ganhouA = true : ganhouB = true;




    equipePartidaA.idPartida = id;
    equipePartidaA.pontuacao = pontuacaoEquipeA;
    equipePartidaA.setsGanhos = setsganhosA;
    equipePartidaA.pontosNosSets = equipePartidaA.pontosNosSets.concat(pontoNoSetA)
    equipePartidaA.ganhou = ganhouA;
    equipePartidaA.setsDisputados = sets_disputados;
    equipePartidaA.resultadoCadastradoEm = new Date()


    equipePartidaB.idPartida = id;
    equipePartidaB.pontuacao = pontuacaoEquipeB;
    equipePartidaB.setsGanhos = setsganhosB;
    equipePartidaB.pontosNosSets = equipePartidaB.pontosNosSets.concat(pontoNoSetB)
    equipePartidaB.ganhou = ganhouB;
    equipePartidaB.setsDisputados = sets_disputados;
    equipePartidaB.resultadoCadastradoEm = new Date()

    await this.equipesPartidaRepository.save(equipePartidaA);
    await this.equipesPartidaRepository.save(equipePartidaB);

    setsganhosA > setsganhosB ? partida.idGanhadora = equipePartidaA.id : partida.idGanhadora = equipePartidaB.id;
    partida.status = StatusPartida.CONCLUIDA;
    await this.partidaRepository.save(partida);

    await this.pontuacaoViewRepositor.refreshMaterializedView();



    return new CadastrarResultadoPartidaRespostaDTO(equipePartidaA, equipePartidaB)
  }



}
