import { ValidationError } from "@nestjs/common";

function FormatterError(errors: ValidationError[]): any {
  if (!errors) {
    return;
  }
  const dataError = {};
  errors.forEach((error) => {
    const { property, constraints } = error;
    if (constraints) {
      Object.keys(constraints).forEach((key) => {
        dataError[property] = constraints[key];
      });
    }
  });
  return dataError;
}

export type FormatterErrorType = {
  statusCode: number;
  message: string;
  errors: any;
};

export default FormatterError;
