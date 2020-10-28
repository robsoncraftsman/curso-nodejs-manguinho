import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class LogErrorControllerDecorator implements Controller {
  constructor(private readonly controller: Controller, private readonly logErrorRepository: LogErrorRepository) {}

  async logError(message: string, stack?: string): Promise<void> {
    console.error(message);
    await this.logErrorRepository.logError(message, stack);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500 && httpResponse.body instanceof Error) {
      await this.logError(httpResponse.body.message, httpResponse.body.stack);
    }
    return httpResponse;
  }
}
