import { Controller, EmailValidator, HttpRequest, HttpResponse } from '../protocols';
import { MissingParamError } from '../errors/missing-param-error';
import { ok, badRequest, serverError } from '../helpers/http-helper';
import { InvalidParamError } from '../errors';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingParamError(requiredField));
        }
      }

      const { email } = httpRequest.body;
      if (!this.emailValidator.isValid(email)) {
        return badRequest(new InvalidParamError('email'));
      }

      return ok();
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
