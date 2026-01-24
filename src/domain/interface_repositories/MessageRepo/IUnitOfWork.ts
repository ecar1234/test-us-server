export interface IUnitOfWork {
  // 트랜잭션 내에서 실행할 로직을 콜백으로 받습니다.
  runInTransaction<T>(work: (context: any) => Promise<T>): Promise<T>;
}