import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class ResponseErrorControllerDecorator implements Controller {
  constructor(private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.body instanceof Error) {
      httpResponse.body = httpResponse.body.message;
    }
    return httpResponse;
  }
}
