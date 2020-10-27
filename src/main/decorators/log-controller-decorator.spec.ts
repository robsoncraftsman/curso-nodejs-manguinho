import { ServerError } from '../../presentation/errors';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log-controller-decorator';
import { ok, serverError } from '../../presentation/helpers/http-helper';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok('OK')));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    const httpRequest = { body: 'OK' };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenLastCalledWith(httpRequest);
  });

  test('Should return the same httpResponse', async () => {
    const { sut } = makeSut();
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual('OK');
  });

  test('Should return a server error and call logError', async () => {
    const { sut, controllerStub } = makeSut();
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError(new Error()))));
    const logSpy = jest.spyOn(sut, 'logError');
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(new Error()));
    expect(logSpy).toHaveBeenLastCalledWith(httpResponse.body);
  });
});
