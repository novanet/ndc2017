import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Promise } from 'es6-promise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PhotoService {

    private http: Http;
    constructor(http: Http) {
        this.http = http;
    }

    public publishImage(userId: number, file: File): Promise<any> {
        let headers = new Headers({ 'Authorization': '<api key>', 'Content-Type': 'application/json; charset=utf-8' });

        let options = {
            headers: headers
        }

        let form = new FormData();
        form.append('file', file);

        return this.http.post(`/api/photo/${userId}`, form, options).toPromise().then((response: any) => {
            return Promise.resolve(JSON.parse(response._body));
        }).catch(response => {
            return Promise.reject(response._body);
        });
    }
}