import { ConflictException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class VerificaUrlService {
  private readonly axios: AxiosInstance = axios.create();

  async ehImagem(url: string) {
    const result = await this.axios
      .get(url)
      .then((res) => res.headers['Content-Type'])
      .then((contentType) => contentType.startsWith('image/'))
      .catch(() => false);

    if (!result) {
      throw new ConflictException(`${url} não é uma imagem`);
    }
  }
}
