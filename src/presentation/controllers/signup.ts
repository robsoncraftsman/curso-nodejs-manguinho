import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { MissingParamError } from '../errors/missing-param-error';
import { ok, badRequest, serverError } from '../helpers/http-helper';
import { InvalidParamError } from '../errors';
import { AddAccount } from '../../domain/usecases/add-account';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator, private readonly addAccount: AddAccount) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      this.addAccount.add({ name, email, password });

      return ok();
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
