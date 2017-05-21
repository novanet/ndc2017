import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Promise } from 'es6-promise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {
    private http: Http;

    constructor(http: Http) {
        this.http = http;
    }

    public checkAuth(authKey: string): Promise<boolean> {
        let headers = new Headers({ 'Authorization': authKey, 'Content-Type': 'application/json' });

        let options = {
            headers: headers
        }

        return this.http.get('/api/login', options)
            .toPromise()
            .then(response => Promise.resolve(true))
            .catch(response => Promise.resolve(false));

    }
}