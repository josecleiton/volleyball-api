import { Test } from '@nestjs/testing';
import faker = require('faker');
import { InternalServerErrorException } from '@nestjs/common';
import { eachHourOfInterval, setHours } from 'date-fns';
import { EscolhaDeMando } from '../dto/tabela.dto';
import { SemifinalGeneratorService } from './semifinal-generator.service';
import { PartidaService } from 'src/modules/partida/partida.service';
import { MataMataGeneratorService } from './mata-mata-generator.service';
import { EquipeRespostaDto } from 'src/modules/equipe/dto/equipe.dto';
import { PartidaRespostaDto } from 'src/modules/partida/dto/partida.dto';
import { PartidaStatus } from 'src/modules/partida/enums/partida-status.enum';

const mockPartidaService = () => ({
  listaPartidasOrdenadas: jest.fn(),
});

describe('SemifinalGeneratorService', () => {
  let sut: SemifinalGeneratorService;
  let partidaService: jest.Mocked<PartidaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SemifinalGeneratorService,
        {
          provide: PartidaService,
          useFactory: mockPartidaService,
        },
      ],
    }).compile();

    sut = await module.resolve<SemifinalGeneratorService>(
      SemifinalGeneratorService,
    );
    partidaService = module.get(PartidaService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(partidaService).toBeDefined();
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
        end: setHours(new Date(), 13),
      });
      expect(datas).toHaveLength(
        MataMataGeneratorService.quantidadeDePartidasNasSemis,
      );

      const mandos = [
        EscolhaDeMando.PRIMEIRO_JOGO,
        EscolhaDeMando.SEGUNDO_JOGO,
      ];
      const equipes: EquipeRespostaDto[] = [...Array(8).keys()]
        .reverse()
        .map(() => ({
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
        Pick<PartidaRespostaDto, 'status'>;
      function geraPartida(
        mandante: number,
        visitante: number,
        ganhador?: number,
      ): PartidaRespostaDto {
        const partidaParcial: IPartidaParcial = {
          dataAtualizacao: new Date(),
          dataComeco: new Date(),
          dataCriacao: new Date(),
          status: PartidaStatus.CONCLUIDA,
          dataFinalizacao: new Date(),
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
        const partidas: PartidaRespostaDto[] = [
          geraPartida(0, 7, 0),
          geraPartida(7, 0, 0),
          geraPartida(0, 7),
          geraPartida(1, 6, 6),
          geraPartida(6, 1, 1),
          geraPartida(1, 6, 1),
          geraPartida(2, 5, 2),
          geraPartida(5, 2, 2),
          geraPartida(2, 5),
          geraPartida(3, 4, 3),
          geraPartida(4, 3, 3),
          geraPartida(3, 4),
        ];
        expect(partidas).toHaveLength(12);

        partidaService.listaPartidasOrdenadas.mockResolvedValue(partidas);

        const resultado = await sut.geraPartidas({ datas, mandos, idLiga });
        expect(resultado).toHaveLength(datas.length);

        expect(resultado.every((x) => x.tipoDaRodada === 'semis')).toBeTruthy();
        const vencedores = [
          partidas[0].equipeGanhadora,
          partidas[5].equipeGanhadora,
          partidas[6].equipeGanhadora,
          partidas[9].equipeGanhadora,
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
