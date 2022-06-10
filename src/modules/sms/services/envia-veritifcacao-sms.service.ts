import { Inject, Injectable } from '@nestjs/common';
import { MessageBird } from 'messagebird/types';
import { IEnviaVerificacaoSmsResposta } from '../dtos/sms.dto';
import { MESSAGEBIRD } from '../sms.constant';

@Injectable()
export class EnviaVerificacaoSmsService {
  constructor(@Inject(MESSAGEBIRD) private readonly messageBird: MessageBird) {}

  async executa(telefone: string): Promise<IEnviaVerificacaoSmsResposta> {
    return new Promise((resolve, reject) =>
      this.messageBird.verify.create(telefone, (err, verify) => {
        if (err || !verify) {
          return reject(err);
        }

        return resolve({
          id: verify.id,
          expiraEm: new Date(verify.validUntilDatetime),
        });
      }),
    );
  }
}
