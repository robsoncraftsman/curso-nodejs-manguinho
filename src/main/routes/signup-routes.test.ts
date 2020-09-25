import app from '../config/app';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { getEnv } from '../../util/env-helper';

describe('SignUp Routes', () => {
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

  test('Should return an AddAccountModel on post ', async () => {
    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    };
    const response = await request(app).post('/api/signup').send(account);
    expect(response.status).toBe(200);
  });
});
