import { Test } from '@nestjs/testing';
import { Equipe } from 'src/modules/equipe/entities/equipe.entity';
import { ClassificacaoGeneratorService } from './classificacao-generator.service';
import faker = require('faker');
import { DiaDaSemana } from 'src/modules/core/enums/dia-da-semana.enum';
import { BadRequestException } from '@nestjs/common';
import { differenceInBusinessDays } from 'date-fns';

describe('ClassificacaoGeneratorService', () => {
  let sut: ClassificacaoGeneratorService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ClassificacaoGeneratorService],
    }).compile();

    sut = await module.resolve<ClassificacaoGeneratorService>(
      ClassificacaoGeneratorService,
    );
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('geraPartidas', () => {
    it('deve dar erro, porque quantidade de equipe é ímpar', () => {
      const equipes = [...Array(5).keys()].map((i) =>
        Object.assign(new Equipe(), { id: (i + 1).toString() }),
      );
      expect(() =>
        sut.geraPartidas({
          equipes,
          diasDaSemana: [],
          horarios: [],
          dataComeco: new Date(),
        }),
      ).toThrowError(new BadRequestException('Quantidade de equipe é ímpar'));
    });
    it('deve dar erro, porque não é possível agendar um jogo na semana pra cada equipe', () => {
      const equipes = [...Array(6).keys()].map((i) =>
        Object.assign(new Equipe(), { id: (i + 1).toString() }),
      );
      const diasDaSemana = [DiaDaSemana.Sábado, DiaDaSemana.Domingo];
      const horarios = [...Array(3).keys()].map(() =>
        faker.datatype.number({ min: 6 * 60, max: 20 * 60 }),
      );
      expect(() =>
        sut.geraPartidas({
          equipes,
          diasDaSemana,
          horarios,
          dataComeco: new Date(),
        }),
      ).toThrowError(
        new BadRequestException(
          'Não é possível agendar um jogo por semana (rodada) para cada equipe. O produto entre o tamanho da lista de dias da semana e horarios tem que ser igual a metade do número de equipes',
        ),
      );
    });
    it('6 equipes, 1 dia da semana e 3 horários', () => {
      const equipes = [...Array(6).keys()].map((i) =>
        Object.assign(new Equipe(), {
          id: (i + 1).toString(),
          idGinasio: faker.datatype.uuid(),
        }),
      );
      const diasDaSemana = [DiaDaSemana.Sábado];
      const horarios = [...Array(3).keys()].map(() =>
        faker.datatype.number({ min: 6 * 60, max: 20 * 60 }),
      );

      const dataComeco = new Date();

      const partidas = sut.geraPartidas({
        equipes,
        diasDaSemana,
        horarios,
        dataComeco,
      });

      expect(partidas).toHaveLength(equipes.length * (equipes.length - 1));
      // É preciso pelo menos um descanso de 3 dias úteis para os atletas
      expect(
        differenceInBusinessDays(
          partidas[partidas.length / 2].dataComeco,
          partidas[partidas.length / 2 - 1].dataComeco,
        ),
      ).toBeGreaterThan(3);
    });
  });
});
