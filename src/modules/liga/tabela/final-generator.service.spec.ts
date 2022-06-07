import { Test } from '@nestjs/testing';
import faker = require('faker');
import { InternalServerErrorException } from '@nestjs/common';
import { eachHourOfInterval, setHours } from 'date-fns';
import { EscolhaDeMando } from '../dto/tabela.dto';
import { PartidaService } from 'src/modules/partida/services/partida.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { StatusPartida } from 'src/modules/partida/enums/status-partida.enum';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { FinalGeneratorService } from './final-generator.service';

faker.locale = 'pt_BR';

const mockPartidaService = () => ({
  listaPartidasOrdenadas: jest.fn(),
});

const mockPontuacaoEquipeService = () => ({
  listaPontuacoesOrdenadas: jest.fn(),
});

describe('FinalGeneratorService', () => {
  let sut: FinalGeneratorService;
  let partidaService: jest.Mocked<PartidaService>;
  let pontuacaoEquipeService: jest.Mocked<PontuacaoEquipeService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FinalGeneratorService,
        {
          provide: PartidaService,
          useFactory: mockPartidaService,
        },
        {
          provide: PontuacaoEquipeService,
          useFactory: mockPontuacaoEquipeService,
        },
      ],
    }).compile();

    sut = await module.resolve<FinalGeneratorService>(FinalGeneratorService);
    partidaService = module.get(PartidaService);
    pontuacaoEquipeService = module.get(PontuacaoEquipeService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(partidaService).toBeDefined();
    expect(pontuacaoEquipeService).toBeDefined();
  });

  describe('geraPartidas', () => {
    it('deve dar erro, porque não tem partidas suficientes', async () => {
      partidaService.listaPartidasOrdenadas.mockResolvedValue([]);
      await expect(
        sut.geraPartidas({
          datas: [],
          idLiga: faker.datatype.uuid(),
          mandos: [],
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    describe('manda quantidade de equipes correta', () => {
      const idLiga = faker.datatype.uuid();
      const datas = eachHourOfInterval({
        start: setHours(new Date(), 8),
        end: setHours(new Date(), 10),
      });
      expect(datas).toHaveLength(
        MataMataGeneratorService.quantidadeDePartidasNaFinal,
      );

      const mandos = [EscolhaDeMando.SEGUNDO_JOGO];
      const equipes: EquipeRespostaDto[] = [...Array(8).keys()].map(() => ({
        id: faker.datatype.uuid(),
        nome: faker.company.companyName(),
        urlBrasao: faker.internet.url(),
        apta: true,
        descricaoAptidao: [],
        cidade: faker.address.city(),
        estado: faker.address.state(),
        idLiga: faker.datatype.uuid(),
        idGinasio: faker.datatype.uuid(),
        quantidadeAtletas: faker.datatype.number({ min: 15, max: 22 }),
        atletas: [],
        auxiliares: [],
        quantidadeAuxiliares: faker.datatype.number({ min: 1, max: 10 }),
      }));

      type IPartidaParcial = Pick<PartidaRespostaDto, 'dataComeco'> &
        Pick<PartidaRespostaDto, 'dataCriacao'> &
        Pick<PartidaRespostaDto, 'dataAtualizacao'> &
        Pick<PartidaRespostaDto, 'dataFinalizacao'> &
        Pick<PartidaRespostaDto, 'status'> &
        Pick<PartidaRespostaDto, 'tipoRodada'>;
      function geraPartida(
        mandante: number,
        visitante: number,
        ganhador?: number,
      ): PartidaRespostaDto {
        const partidaParcial: IPartidaParcial = {
          dataAtualizacao: new Date(),
          dataComeco: new Date(),
          dataCriacao: new Date(),
          status: StatusPartida.CONCLUIDA,
          dataFinalizacao: new Date(),
          tipoRodada: 'semis',
        };
        return {
          id: faker.datatype.uuid(),
          idEquipeMandante: equipes[mandante].id,
          idEquipeVisitante: equipes[visitante].id,
          idGinasio: equipes[mandante].idGinasio,
          idEquipeGanhador:
            ganhador !== undefined ? equipes[ganhador].id : undefined,
          equipeGanhadora:
            ganhador !== undefined ? equipes[ganhador] : undefined,
          ...partidaParcial,
        };
      }
      it('deve gerar os dois confrontos com três partidas agendadas para cada', async () => {
        // classificou a 0 (0 x 7)
        // classificou a 1 (1 x 6)
        // classificou a 2 (2 x 5)
        // classificou a 3 (3 x 4)
        const partidas: PartidaRespostaDto[] = [
          geraPartida(0, 3, 0),
          geraPartida(3, 0, 0),
          geraPartida(0, 3),
          geraPartida(1, 2, 2),
          geraPartida(1, 2, 1),
          geraPartida(1, 2, 1),
        ];
        expect(partidas).toHaveLength(
          MataMataGeneratorService.quantidadeDePartidasNasSemis,
        );

        partidaService.listaPartidasOrdenadas.mockResolvedValue(partidas);
        const pontuacoes = [...Array(8).keys()]
          .map((x, index) => ({
            equipe: {
              id: equipes[index].id,
              idGinasio: equipes[index].idGinasio,
              idLiga: equipes[index].idLiga,
              nome: equipes[index].nome,
            },
            pontuacao: 7 * (x + 1) - index,
          }))
          .sort((a, b) => b.pontuacao - a.pontuacao);

        pontuacaoEquipeService.listaPontuacoesOrdenadas.mockResolvedValue(
          pontuacoes,
        );

        const resultado = await sut.geraPartidas({ datas, mandos, idLiga });
        expect(resultado).toHaveLength(datas.length);

        expect(resultado.every((x) => x.tipoDaRodada === 'final')).toBeTruthy();
        const vencedores = [
          partidas[0].equipeGanhadora,
          partidas[1].equipeGanhadora,
        ] as EquipeRespostaDto[];
        mandos.forEach((mando, index) => {
          const indexPartida =
            index * 3 + (mando === EscolhaDeMando.PRIMEIRO_JOGO ? 0 : 1);

          expect(resultado[indexPartida].idMandante).toEqual(
            vencedores[index].id,
          );

          expect(resultado[indexPartida].idGinasio).toEqual(
            vencedores[index].idGinasio,
          );
        });
      });
    });
  });
});
