import { EntityManager, Repository } from 'typeorm';

export abstract class MaterializedViewRepository<T> extends Repository<T> {
  protected abstract readonly name: string;
  protected abstract readonly concurrently: boolean;

  private get concurrentlyQuery(): string {
    return this.concurrently ? 'CONCURRENTLY ' : '';
  }

  async refreshMaterializedView(manager: EntityManager) {
    return manager.query(
      `REFRESH MATERIALIZED VIEW ${this.concurrentlyQuery} "${this.name}"`,
    );
  }
}
