import { AccountModel } from '../../domain/models/account';
import { AddAccount, AddAccountModel } from '../../domain/usecases/add-account';
import { AddAccountRepository } from '../protocols/add-account-repository';
import { Encrypter } from '../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  constructor(private readonly encrypter: Encrypter, private readonly addAccountRepository: AddAccountRepository) {}

  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(addAccountModel.password);
    return this.addAccountRepository.add(Object.assign({}, addAccountModel, { password: hashedPassword }));
  }
}
