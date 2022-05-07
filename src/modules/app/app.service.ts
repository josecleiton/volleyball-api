import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private counter = 0;

  increase() {
    return ++this.counter;
  }

  sum(x: number, y: number): number {
    return x + y;
  }
}

