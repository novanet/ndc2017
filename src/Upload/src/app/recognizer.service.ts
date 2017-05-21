import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Promise } from 'es6-promise';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RecognizerService {

    private http: Http;    
    constructor(http: Http) { 
        this.http = http;
    }

    public processFile(file: File): Promise<any> {
        let form = new FormData();
        form.append('file', file);
        return this.http.post('/api/recognizer/image', form)
            .toPromise()
            .then((response: any) => {
                return Promise.resolve(response.json());
            }, (response: any) => {
                console.log("result is " + response);
                if (response.status === 404)
                    return Promise.resolve(response.json());
            });
    }
}