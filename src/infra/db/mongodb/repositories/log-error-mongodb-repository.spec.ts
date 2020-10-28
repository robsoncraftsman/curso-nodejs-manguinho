import { Collection } from 'mongodb';
import { getEnv } from '../../../../util/env-helper';
import { MongoHelper } from '../helpers/mongo-helper';
import { LogMongoDbRepository } from './log-error-mongodb-repository';

const makeSut = (): LogMongoDbRepository => {
  return new LogMongoDbRepository();
};

let errorCollection: Collection | null = null;

describe('LogRepositoryMongoDB', () => {
  beforeAll(async () => {
    await MongoHelper.connect(getEnv('MONGO_URL'));
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors');
    await errorCollection.deleteMany({});
  });

  test('Should create an error log', async () => {
    const sut = makeSut();
    await sut.logError('Test error', 'Test error stack');
    const count = await errorCollection?.countDocuments();
    expect(count).toBe(1);
  });
});
