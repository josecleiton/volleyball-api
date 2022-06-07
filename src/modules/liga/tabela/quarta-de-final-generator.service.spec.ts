import { Test } from '@nestjs/testing';
import { PontuacaoEquipeService } from '../services/pontuacao-equipe.service';
import { QuartaDeFinalGeneratorService } from './quarta-de-final-generator.service';
import faker = require('faker');
import { ConflictException } from '@nestjs/common';
import { eachHourOfInterval, setHours } from 'date-fns';
import { EscolhaDeMando } from '../dto/tabela.dto';

const mockPontuacaoEquipeService = () => ({
  listaPontuacoesOrdenadas: jest.fn(),
});

describe('QuartaDeFinalGeneratorService', () => {
  let sut: QuartaDeFinalGeneratorService;
  let pontuacaoEquipeService: jest.Mocked<PontuacaoEquipeService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuartaDeFinalGeneratorService,
        {
          provide: PontuacaoEquipeService,
          useFactory: mockPontuacaoEquipeService,
        },
      ],
    }).compile();

    sut = await module.resolve<QuartaDeFinalGeneratorService>(
      QuartaDeFinalGeneratorService,
    );
    pontuacaoEquipeService = module.get(PontuacaoEquipeService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
    expect(pontuacaoEquipeService).toBeDefined();
  });

  describe('geraPartidas', () => {
    it('deve dar erro, porque não tem pontuações suficientes', async () => {
      pontuacaoEquipeService.listaPontuacoesOrdenadas.mockResolvedValue([]);
      await expect(
        sut.geraPartidas({
          datas: [],
          idLiga: faker.datatype.uuid(),
          mandos: [],
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('deve gerar os quatro confrontos com três partidas agendadas para cada', async () => {
      const idLiga = faker.datatype.uuid();
      const datas = eachHourOfInterval({
        start: setHours(new Date(), 8),
        end: setHours(new Date(), 19),
      });
      expect(datas).toHaveLength(12);

      const mandos = [
        EscolhaDeMando.PRIMEIRO_JOGO,
        EscolhaDeMando.SEGUNDO_JOGO,
        EscolhaDeMando.PRIMEIRO_JOGO,
        EscolhaDeMando.PRIMEIRO_JOGO,
      ];
      const pontuacoes = [...Array(8).keys()].reverse().map((x, index) => ({
        equipe: {
          id: faker.datatype.uuid(),
          idGinasio: faker.datatype.uuid(),
          idLiga: faker.datatype.uuid(),
          nome: faker.company.companyName(),
        },
        pontuacao: 7 * (x + 1) - index,
      }));
      pontuacaoEquipeService.listaPontuacoesOrdenadas.mockResolvedValue(
        pontuacoes,
      );

      const partidas = await sut.geraPartidas({ datas, mandos, idLiga });

      expect(partidas).toHaveLength(datas.length);
      expect(partidas.every((x) => x.tipoDaRodada === 'quartas')).toBeTruthy();
      mandos.forEach((mando, index) => {
        const indexPartida =
          index * 3 + (mando === EscolhaDeMando.PRIMEIRO_JOGO ? 0 : 1);

        expect(partidas[indexPartida].idMandante).toEqual(
          pontuacoes[index].equipe.id,
        );

        expect(partidas[indexPartida].idGinasio).toEqual(
          pontuacoes[index].equipe.idGinasio,
        );
      });
    });
  });
});
