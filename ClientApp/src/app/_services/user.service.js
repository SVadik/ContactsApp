var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};
let UserService = class UserService {
    constructor(http) {
        this.http = http;
    }
    getAllUsers(url) {
        return this.http.get(url)
            .pipe(catchError(this.handleError));
    }
    getById(id) {
        return this.http.get(`${environment.apiUrl}/users/${id}`);
    }
    updateUser(url, user) {
        // const newurl = `${url}?id=${id}`;
        return this.http.put(url, JSON.stringify(user), httpOptions)
            .pipe(catchError(this.handleError));
    }
    // delete contact information
    deleteUser(url, id) {
        const newurl = `${url}?id=${id}`; // DELETE api/contact?id=42
        return this.http.delete(newurl, httpOptions);
    }
    handleError(error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(`Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError('Something bad happened; please try again later.');
    }
};
UserService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [HttpClient])
], UserService);
export { UserService };
