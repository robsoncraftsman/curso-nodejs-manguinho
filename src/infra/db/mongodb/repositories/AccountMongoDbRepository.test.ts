import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { AccountMongoDbRepository } from './AccountMongoDbRepository';
import { MongoHelper } from '../helpers/mongo-helper';
import { getEnv } from '../../../../util/env-helper';

const makeSut = (): AccountMongoDbRepository => {
  return new AccountMongoDbRepository();
};

describe('MongoDb AccountRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(getEnv('MONGO_URL'));
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  });

  test('Should return an account on success', async () => {
    const sut = makeSut();
    const addAccountModel: AddAccountModel = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'hashed_password'
    };
    const accountModel = await sut.add(addAccountModel);
    expect(accountModel).toBeTruthy();
    expect(accountModel.id).toBeTruthy();
    expect(accountModel.name).toBe('any_name');
    expect(accountModel.email).toBe('any_email@email.com');
    expect(accountModel.password).toBe('hashed_password');
  });
});
