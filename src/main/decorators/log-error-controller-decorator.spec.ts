import { ServerError } from '../../presentation/errors';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogErrorControllerDecorator } from './log-error-controller-decorator';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { ok, serverError } from '../../presentation/helpers/http-helper';

interface SutTypes {
  sut: LogErrorControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) => resolve(ok('OK')));
    }
  }
  return new ControllerStub();
};

const makeLogErrorRepositoryStub = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError(message: string, stack?: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new LogErrorRepositoryStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const logErrorRepositoryStub = makeLogErrorRepositoryStub();
  const sut = new LogErrorControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  };
};

describe('LogErrorControllerDecorator', () => {
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
    const logErrorSpy = jest.spyOn(sut, 'logError');
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(new Error()));
    expect(logErrorSpy).toHaveBeenLastCalledWith(httpResponse.body.message, httpResponse.body.stack);
  });

  test('Should return a server error and call LogErrorRepository', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError(new Error()))));
    const logErrorSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(new Error()));
    expect(logErrorSpy).toHaveBeenLastCalledWith(httpResponse.body.message, httpResponse.body.stack);
  });
});
