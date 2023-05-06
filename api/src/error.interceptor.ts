import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import * as Sentry from "@sentry/node";

const ignoredMessage = [
  "File not found",
  "User not found / Incorrect password",
  "Incorrect password"
]

@Injectable()
export class ErroInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError((err, _) => {
        if (!ignoredMessage.some(mess => mess == err.message)) {
          Sentry.captureException(err)
        }
        throw err
      }));
  }
}

