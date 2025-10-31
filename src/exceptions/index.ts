export class HttpException extends Error {
  public status: number;

  constructor(status: number, message: string, loggerMessage?: string) {
    super(message);
    this.status = status;
  }
}