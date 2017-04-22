import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Promise } from 'es6-promise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileService {

    private http: Http;    
    constructor(http: Http) { 
        this.http = http;
    }

    public processFile(file: File): Promise<any> {
        let form = new FormData();
        form.append('file', file);

        return this.http.post('/api/image/processimage', form).toPromise().then((response: any) => {
            return Promise.resolve(JSON.parse(response._body));
        });
    }
}