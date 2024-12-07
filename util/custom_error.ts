type CustomResponseData = { message: string, statusCode: number, errorPath?: string[], data?: { [key: string]: string } }
// const defaultCustomResponse: CustomResponseData = { message: '', statusCode: 0, errorPath: [], data: {} }

export class CustomResponse extends Error {
  statusCode: number;
  errorPath: string[]; // when there is error in form fields, the name of the fields with error will be returned in this array
  data: { [key: string]: string }

  constructor(data: CustomResponseData) {
    super(data.message);
    this.statusCode = data.statusCode;
    this.errorPath = data.errorPath ?? [];
    this.data = data.data ?? {};
    Object.setPrototypeOf(this, CustomResponse.prototype);
  }

  toJson(): { [key: string]: any } {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorPath: this.errorPath,
      data: this.data,
    }
  }
}
