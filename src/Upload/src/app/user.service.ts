import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Promise } from 'es6-promise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    private http: Http;
    constructor(http: Http) {
        this.http = http;
    }

    public createUser(name: string, email: string, company: string, twitterHandle: string): Promise<any> {
        let headers = new Headers({ 'Authorization': 'Trondheimsnatt', 'Content-Type': 'application/json' });
        let data = {
            'name': name,
            'email': email,
            'company': company,
            'twitterHandle': twitterHandle
        }
        let options = {
            headers: headers
           
        }
        return this.http.post('/api/user',data, options).toPromise().then((response: any) => {
            return Promise.resolve(JSON.parse(response._body));
        });
    }
}