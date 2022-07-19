import { HttpService } from '@nestjs/axios';
import { Injectable, ConflictException } from '@nestjs/common';
import { firstValueFrom, map, catchError, of } from 'rxjs';

@Injectable()
export class VerificaUrlService {
  constructor(private readonly httpService: HttpService) {}

  async ehImagem(url: string) {
    const result = await firstValueFrom(
      this.httpService.get(url).pipe(
        map((res) => res.headers['content-type'].startsWith('image/')),
        catchError(() => of(false)),
      ),
    );

    if (!result) {
      throw new ConflictException(`${url} não é uma imagem`);
    }
  }
}
