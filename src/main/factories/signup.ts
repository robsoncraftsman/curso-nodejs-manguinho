import { SignUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../util/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/db-add-account';
import { BCryptAdapter } from '../../infra/cryprography/bcrypt-adpater';
import { AccountMongoDbRepository } from '../../infra/db/mongodb/repositories/AccountMongoDbRepository';
import env from '../config/env';
import { ResponseErrorControllerDecorator } from '../decorators/response-error-controller-decorator';
import { LogControllerDecorator } from '../decorators/log-controller-decorator';
import { Controller } from '../../presentation/protocols';

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcrypAdapter = new BCryptAdapter(env.SALT);
  const accountMongoDbRepository = new AccountMongoDbRepository();
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoDbRepository);
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount);
  const logControllerDecorator = new LogControllerDecorator(signupController);
  const responseErrorControllerDecorator = new ResponseErrorControllerDecorator(logControllerDecorator);
  return responseErrorControllerDecorator;
};
