import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { forEach, isNil, isString } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class HttpHelperService {
  constructor(private httpClient: HttpClient) {}

  get(url: string, options?: any, types?: any): Observable<any> {
    return this.httpClient
      .get(url, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err.error ? err.error : err)));
  }

  /**
   * Performs a request with 'post' http method.
   * @param url the url
   * @param body the request body
   * @param options the request options
   */
  post(url: string, body: any, options: any) {
    return this.httpClient
      .post(url, body, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err.error ? err.error : err)));
  }

    /* Performs a request with put http method.
    @param url the url
    @param body the request body
    @param options the request options
    */
  put(url: string, body: any, options?: any) {
    return this.httpClient
      .put(url, body, this.requestOptions(options))
      .pipe(catchError((err) => this.catchError(err.error ? err.error : err)));
  }

  delete(url: string, options?: any) {
    return this.httpClient
      .delete(url, options)
      .pipe(catchError((err) => this.catchError(err)));
  }

  catchError(error: Response): Observable<Response> {
    return throwError(error);
  }

  private requestOptions(options?: any): any {
    if (options == null) {
      options = {};
    }

    if (options.params != null) {
      if (!isString(options.params)) {
        forEach(options.params, (value, key) => {
          if (isNil(value) || (isString(value) && value.length === 0)) {
            delete options.params[key];
          }
        });
      }
    }
    return options;
  }
}
