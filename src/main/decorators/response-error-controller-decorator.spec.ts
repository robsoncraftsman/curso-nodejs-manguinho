import { InvalidParamError, MissingParamError } from '../../presentation/errors';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { ResponseErrorControllerDecorator } from './response-error-controller-decorator';
import { ok, badRequest, serverError } from '../../presentation/helpers/http-helper';

interface SutTypes {
  sut: ResponseErrorControllerDecorator;
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
  const sut = new ResponseErrorControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub: controllerStub
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle on MissingParamError', async () => {
    const { sut, controllerStub } = makeSut();
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(badRequest(new MissingParamError('teste')))));
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual('Missing param: teste');
  });

  test('Should call controller handle on InvalidParamError', async () => {
    const { sut, controllerStub } = makeSut();
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(badRequest(new InvalidParamError('teste')))));
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual('Invalid param: teste');
  });

  test('Should call controller handle on ServerError', async () => {
    const { sut, controllerStub } = makeSut();
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(serverError(new Error()))));
    const httpRequest = { body: 'OK' };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual('Server error');
  });
});
