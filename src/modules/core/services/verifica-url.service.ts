import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class VerificaUrlService {
  private readonly axios: AxiosInstance = axios.create();

  async ehImagem(url: string) {
    const result = await this.axios
      .get(url)
      .then((res) => res.headers['Content-Type'])
      .then((contentType) => contentType.startsWith('image/'))
      .catch((e) => new InternalServerErrorException(e));

    if (!result) {
      throw new ConflictException(`${url} não é uma imagem`);
    }
  }
}
