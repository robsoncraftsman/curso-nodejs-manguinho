import { BCryptAdapter } from './bcrypt-adpater';
import bcrypt from 'bcrypt';

const SALT = 12;

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(SALT);
};

describe('BCrypt Adapater', () => {
  test('Should call bcrypt with correct value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });
});
