export class ServerError extends Error {
  constructor() {
    super('Server error');
    this.name = 'ServerError';
  }
}
