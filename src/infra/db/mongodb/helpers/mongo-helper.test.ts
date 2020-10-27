import { MongoHelper as sut } from './mongo-helper';
import { getEnv } from '../../../../util/env-helper';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(getEnv('MONGO_URL'));
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should be connected to MongoDB', () => {
    expect(sut.isConnected()).toBeTruthy();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    expect(sut.isConnected()).toBeFalsy();
    accountCollection = await sut.getCollection('accounts');
    expect(accountCollection).toBeTruthy();
  });
});
