import { Liga } from '../entities/liga.entity';

export type LigaIdStatus = Pick<Liga, 'id'> & Pick<Liga, 'status'>;
