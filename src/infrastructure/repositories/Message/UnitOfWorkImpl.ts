import { DataSource, EntityManager } from "typeorm";
import { IUnitOfWork } from "../../../domain/interface_repositories/MessageRepo/IUnitOfWork.js";


// @Injectable() // 의존성 주입 프레임워크 사용 시
export class TypeOrmUnitOfWork implements IUnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async runInTransaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 핵심: 트랜잭션이 걸린 manager를 콜백함수에 넘겨줍니다.
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

// function Injectable(): (target: typeof TypeOrmUnitOfWork) => void | typeof TypeOrmUnitOfWork {
//     throw new Error("Function not implemented.");
// }
