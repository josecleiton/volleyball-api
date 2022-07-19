import { Injectable, Inject } from '@nestjs/common';
import { MessageBird } from 'messagebird/types';
import { IEnviaVerificacaoSmsResposta } from '../dtos';
import { MESSAGEBIRD } from '../sms.constant';

@Injectable()
export class EnviaVerificacaoSmsService {
  constructor(@Inject(MESSAGEBIRD) private readonly messageBird: MessageBird) {}

  private readonly ttl = 600;

  async executa(telefone: string): Promise<IEnviaVerificacaoSmsResposta> {
    return new Promise((resolve, reject) =>
      this.messageBird.verify.create(
        telefone,
        { timeout: this.ttl },
        (err, verify) => {
          if (err || !verify) {
            return reject(err);
          }

          return resolve({
            id: verify.id,
            expiraEm: new Date(verify.validUntilDatetime),
          });
        },
      ),
    );
  }
}
