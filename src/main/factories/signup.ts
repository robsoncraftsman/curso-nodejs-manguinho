import { SignUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../util/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/db-add-account';
import { BCryptAdapter } from '../../infra/cryprography/bcrypt-adpater';
import { AccountMongoDbRepository } from '../../infra/db/mongodb/repositories/AccountMongoDbRepository';
import env from '../config/env';

export const makeSignUpController = (): SignUpController => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcrypAdapter = new BCryptAdapter(env.SALT);
  const accountMongoDbRepository = new AccountMongoDbRepository();
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoDbRepository);
  return new SignUpController(emailValidatorAdapter, dbAddAccount);
};
