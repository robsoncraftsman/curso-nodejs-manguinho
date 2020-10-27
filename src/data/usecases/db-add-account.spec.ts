import { DbAddAccount } from './db-add-account';
import { Encrypter } from '../protocols/encrypter';
import { AccountModel } from '../../domain/models/account';
import { AddAccountModel } from '../../domain/usecases/add-account';
import { AddAccountRepository } from '../protocols/add-account-repository';

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
      const fakeAccountModel = makeValidAccountModel();
      return new Promise((resolve) => resolve(fakeAccountModel));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountRepositoryStub = makeAddAccountRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  };
};

const makeValidAddAccountModel = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
});

const makeValidAddAccountModelWithHashedPassword = (): AddAccountModel => {
  return { ...makeValidAddAccountModel(), ...{ password: 'hashed_password' } };
};

const makeValidAccountModel = (): AccountModel => {
  return { ...makeValidAddAccountModelWithHashedPassword(), ...{ id: 'valid_id' } };
};

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with a correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const addAccountModel = makeValidAddAccountModel();
    await sut.add(addAccountModel);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if Encrypter throws an expcetion', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error();
    });
    const addAccountModel = makeValidAddAccountModel();
    const addPromisse = sut.add(addAccountModel);
    await expect(addPromisse).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
    const addAccountModel = makeValidAddAccountModel();
    await sut.add(addAccountModel);
    expect(addSpy).toHaveBeenCalledWith(makeValidAddAccountModelWithHashedPassword());
  });

  test('Should return correct AccountModel', async () => {
    const { sut } = makeSut();
    const addAccountModel = makeValidAddAccountModel();
    const accountModel = await sut.add(addAccountModel);
    expect(accountModel).toEqual(makeValidAccountModel());
  });

  test('Should throw if AddAccountRepository throws an expcetion', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const addAccountModel = makeValidAddAccountModel();
    const addPromisse = sut.add(addAccountModel);
    await expect(addPromisse).rejects.toThrow();
  });
});
