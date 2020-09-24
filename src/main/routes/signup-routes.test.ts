import app from '../config/app';
import request from 'supertest';

describe('SignUp Routes', () => {
  test('Should return an AddAccountModel on post ', async () => {
    const account = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    };
    await request(app).post('/api/signup').send(account).expect({ ok: 'OK' });
  });
});
