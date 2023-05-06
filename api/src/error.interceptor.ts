import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { throws } from "assert";
import { Observable } from "rxjs";
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
      .pipe(catchError((err, caught) => {
        console.log(err.message)
        if (!ignoredMessage.some(mess => mess == err.message)) {
          Sentry.captureException(err)
        }
        throws(err)
        return caught
      }));
  }
}

