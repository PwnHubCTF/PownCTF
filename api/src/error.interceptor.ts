import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { throws } from "assert";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import * as Sentry from "@sentry/node";

@Injectable()
export class ErroInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError((err, caught) => {
        console.log("test")
        Sentry.captureException(err)
        throws(err)
        return caught
      }));
  }
}

