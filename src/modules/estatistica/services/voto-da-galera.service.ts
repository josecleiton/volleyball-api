import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { isPast } from 'date-fns';
import { LigaService } from 'src/modules/liga/services/liga.service';
import { AtletaService } from 'src/modules/pessoa/services/atleta.service';
import {
  EnviaVerificacaoSmsService,
  VerificaCodigoSmsService,
} from 'src/modules/sms/services';
import { Connection, IsNull } from 'typeorm';
import {
  ConfirmarVotoDto,
  IniciarVotoDto,
  IniciarVotoRespostaDto,
} from '../dto/voto-da-galera.dto';
import { VotoDaGalera } from '../entities/voto-da-galera.entity';
import {
  CraqueDaGaleraViewRepository,
  VotoDaGaleraRepository,
} from '../repositories';

@Injectable()
export class VotoDaGaleraService {
  private readonly logger = new Logger('VotoDaGaleraService');
  constructor(
    private readonly votoDaGaleraRepository: VotoDaGaleraRepository,
    private readonly craqueDaGaleraRepository: CraqueDaGaleraViewRepository,
    private readonly enviaVerificacaoSmsService: EnviaVerificacaoSmsService,
    private readonly verificaCodigoSmsService: VerificaCodigoSmsService,
    private readonly atletaService: AtletaService,
    private readonly ligaService: LigaService,
    private readonly connection: Connection,
  ) {}

  async iniciarVoto(requisicao: IniciarVotoDto) {
    const atleta = await this.atletaService.deveEncontrarComEquipe(
      requisicao.idAtleta,
    );

    await this.ligaService.deveEncontrarLigaIniciada(atleta.equipe.idLiga);

    const jaVotouNaLiga = await this.votoDaGaleraRepository.jaVotouNaLiga(
      requisicao.telefone,
      atleta.equipe.idLiga,
    );

    if (jaVotouNaLiga) {
      throw new ConflictException(
        `Esse telefone já votou na liga ${atleta.equipe.idLiga}`,
      );
    }

    const verificacao = await this.enviaVerificacaoSmsService.executa(
      requisicao.telefone,
    );

    const voto = await this.connection.transaction(async (manager) => {
      await manager.delete(VotoDaGalera, {
        telefone: requisicao.telefone,
        verificadoEm: IsNull(),
      });

      return manager.save(
        this.votoDaGaleraRepository.create({
          atleta,
          idVerificacao: verificacao.id,
          verificacaoExpiraEm: verificacao.expiraEm,
          telefone: requisicao.telefone,
        }),
      );
    });

    return new IniciarVotoRespostaDto(voto);
  }

  async confirmaVoto(id: string, { token }: ConfirmarVotoDto) {
    const voto = await this.votoDaGaleraRepository.findOne({
      where: { id },
      select: ['id', 'idVerificacao', 'verificacaoExpiraEm'],
    });
    if (!voto || isPast(voto.verificacaoExpiraEm)) {
      if (voto) {
        await this.votoDaGaleraRepository.delete(voto.id);
      }

      throw new ForbiddenException(token);
    }

    let verified = false;
    try {
      const status = await this.verificaCodigoSmsService.executa(
        voto.idVerificacao,
        token,
      );
      verified = status === 'verified';
    } catch (e) {
      this.logger.warn(e);
    }

    if (!verified) {
      throw new ForbiddenException(token);
    }

    await this.connection.transaction(async (manager) => {
      await manager.update(VotoDaGalera, voto.id, {
        verificadoEm: new Date(),
      });
      await this.craqueDaGaleraRepository.refreshMaterializedView(manager);
    });
  }
}
