type CustomResponseData = {
  message: string,
  statusCode: number,
  errorPath?: (string | number)[],
  data?: { [key: string]: any },
  status?: boolean,
}

export class CustomResponse extends Error {
  statusCode: number;
  errorPath: (string | number)[]; // when there is error in form fields, the name of the fields with error will be returned in this array
  data: { [key: string]: any };
  status: boolean;

  constructor(data: CustomResponseData) {
    super(data.message);
    this.statusCode = data.statusCode;
    this.errorPath = data.errorPath ?? [];
    this.data = data.data ?? {};
    this.status = data.status ?? false;
    Object.setPrototypeOf(this, CustomResponse.prototype);
  }

  toJson(): { [key: string]: any } {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errorPath: this.errorPath,
      data: this.data,
      status: this.status,
    }
  }
}
