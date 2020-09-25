import { ServerError } from '../../presentation/errors';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { serverError } from '../../presentation/helpers/http-helper';

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(serverError(new Error())));
    }
  }
  return new ControllerStub();
};

const makeSut = (): LogControllerDecorator => {
  const controllerStub = makeControllerStub();
  return new LogControllerDecorator(controllerStub);
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const sut = makeSut();
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(new Error()));
  });
});
