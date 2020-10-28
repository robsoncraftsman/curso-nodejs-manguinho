import { LogErrorRepository } from '../../../../data/protocols/log-error-repository';
import { MongoHelper } from '../helpers/mongo-helper';

export class LogMongoDbRepository implements LogErrorRepository {
  async logError(message: string, stack?: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors');
    const logError = {
      message,
      stack,
      date: new Date()
    };
    await errorCollection.insertOne(logError);
  }
}
