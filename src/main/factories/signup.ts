import { SignUpController } from '../../presentation/controllers/signup';
import { EmailValidatorAdapter } from '../../util/email-validator-adapter';
import { DbAddAccount } from '../../data/usecases/db-add-account';
import { BCryptAdapter } from '../../infra/cryprography/bcrypt-adpater';
import { AccountMongoDbRepository } from '../../infra/db/mongodb/repositories/account-mongodb-repository';
import env from '../config/env';
import { ResponseErrorControllerDecorator } from '../decorators/response-error-controller-decorator';
import { LogErrorControllerDecorator } from '../decorators/log-error-controller-decorator';
import { Controller } from '../../presentation/protocols';
import { LogMongoDbRepository } from '../../infra/db/mongodb/repositories/log-error-mongodb-repository';

export const makeSignUpController = (): Controller => {
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcrypAdapter = new BCryptAdapter(env.SALT);
  const accountMongoDbRepository = new AccountMongoDbRepository();
  const dbAddAccount = new DbAddAccount(bcrypAdapter, accountMongoDbRepository);
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount);
  const logErrorRepository = new LogMongoDbRepository();
  const logControllerDecorator = new LogErrorControllerDecorator(signupController, logErrorRepository);
  const responseErrorControllerDecorator = new ResponseErrorControllerDecorator(logControllerDecorator);
  return responseErrorControllerDecorator;
};
