import { AddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoDbRepository implements AddAccountRepository {
  mapAccountFromMongoDb(accountMongoDb: any): AccountModel {
    return {
      id: accountMongoDb._id,
      name: accountMongoDb.name,
      email: accountMongoDb.email,
      password: accountMongoDb.password
    };
  }

  async add(addAccountModel: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(addAccountModel);
    return this.mapAccountFromMongoDb(result.ops[0]);
  }
}
