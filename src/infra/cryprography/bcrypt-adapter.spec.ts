import { BCryptAdapter } from './bcrypt-adpater';
import bcrypt from 'bcrypt';

const SALT = 12;

const makeSut = (): BCryptAdapter => {
  return new BCryptAdapter(SALT);
};

describe('BCrypt Adapater', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypt('any_value');
    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  test('Should return a hash from value', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(new Promise((resolve) => resolve('hashed_value')));
    const hashedValue = await sut.encrypt('any_value');
    expect(hashedValue).toEqual('hashed_value');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error();
    });
    const encryptPromisse = sut.encrypt('any_value');
    await expect(encryptPromisse).rejects.toThrow();
  });
});
