import { DbAddAccount } from './db-add-account';
import { Encrypter } from '../protocols/encrypter';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const sut = new DbAddAccount(encrypterStub);
  return {
    sut,
    encrypterStub
  };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with a corrent password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const addAccountModel = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    };
    await sut.add(addAccountModel);
    expect(encryptSpy).toHaveBeenCalledWith(addAccountModel.password);
  });

  test('Should throw if Encrypter throws an expcetion', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });
    const addAccountModel = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    };
    const addPromisse = sut.add(addAccountModel);
    await expect(addPromisse).rejects.toThrow();
  });
});
