import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAllUsers(url: string): Observable<User[]> {
      return this.http.get<User[]>(url)
      .pipe(
        
        catchError(this.handleError)
      );
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
    }
    
    updateUser(url: string, user: User): Observable<any> {
      // const newurl = `${url}?id=${id}`;
      return this.http.put(url, JSON.stringify(user), httpOptions)
        .pipe(
          catchError(this.handleError)
        );
    }
  
    // delete contact information
    deleteUser(url: string, id: number): Observable<any> {
      const newurl = `${url}?id=${id}`; // DELETE api/contact?id=42
      return this.http.delete(newurl, httpOptions);
    }
  
    private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    }
}