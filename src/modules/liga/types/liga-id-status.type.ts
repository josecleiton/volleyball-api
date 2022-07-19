import { Liga } from '../entities';

export type LigaIdStatus = Pick<Liga, 'id'> & Pick<Liga, 'status'>;
