import { Response } from 'express';

type HTTPSuccessCode = 200 | 201 | 202 | 206;

export type ResponseMiddleware<
  Responses = any,
  ErrorResponses = Omit<Responses, HTTPSuccessCode>,
  SuccessResponses = Omit<Responses, keyof ErrorResponses>
> = {
  /**
   * @deprecated Use `success` or `error`
   */
  json(data: Responses[keyof Responses]): void;

  // Defaults status code to 200 which applies to majority of endpoints
  success(data: Responses extends { 200: any } ? Responses[200] : never): Promise<void>;
  // Allows a custom status code to be sent along with the expected response payload
  success<T extends keyof SuccessResponses>(
    status: T,
    data: SuccessResponses[T]
  ): Promise<void>;

  // Ensures the provided error code and payload are a matching type
  error<T extends keyof ErrorResponses>(
    status: T,
    data: ErrorResponses[T] extends { error: string }
      ? ErrorResponses[T]
      : never
  ): Promise<void>;
};
