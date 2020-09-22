import { AccountModel } from '../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account';
import { Encrypter } from '../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter) {}

  async add(addAccount: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(addAccount.password);
    return new Promise((resolve) => resolve({ id: 'id', name: 'name', email: 'email', password: 'password' }));
  }
}
