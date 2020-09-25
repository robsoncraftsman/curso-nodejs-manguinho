export class ServerError extends Error {
  private readonly error: Error;

  constructor(error: Error) {
    super('Server error');
    this.name = 'ServerError';
    this.error = error;
  }
}
