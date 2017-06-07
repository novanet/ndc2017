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
        let headers = new Headers({ 'Authorization': sessionStorage['authKey']});

        let options = {
            headers: headers
        }

        let data = new FormData();
        data.append('file', file);

        return this.http.post(`/api/photo/${userId}`, data, options).toPromise().then((response: any) => {
            return Promise.resolve(response.json());
        }).catch(response => {
            return Promise.reject(response.text());
        });
    }
}