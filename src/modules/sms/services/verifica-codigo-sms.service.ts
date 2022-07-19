import { Injectable, Inject } from '@nestjs/common';
import { MessageBird } from 'messagebird/types';
import { MESSAGEBIRD } from '../sms.constant';

@Injectable()
export class VerificaCodigoSmsService {
  constructor(@Inject(MESSAGEBIRD) private readonly messageBird: MessageBird) {}

  async executa(id: string, token: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.messageBird.verify.verify(id, token, (err, verify) => {
        if (err || !verify) {
          return reject(err);
        }

        return resolve(verify.status);
      }),
    );
  }
}
