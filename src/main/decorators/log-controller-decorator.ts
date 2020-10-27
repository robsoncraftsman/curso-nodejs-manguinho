import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  logError(value: any): void {
    console.error(value);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      this.logError(httpResponse.body);
    }
    return httpResponse;
  }
}
