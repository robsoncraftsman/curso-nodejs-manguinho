export interface LogErrorRepository {
  logError: (message: string, stack?: string) => Promise<void>;
}
