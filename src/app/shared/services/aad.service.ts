import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';

const APIEndpoint = environment.APIEndpoint;

@Injectable({
    providedIn: 'root'
})
export class AadService {
    httpOptions: any;
    constructor(private http: HttpClient) {
    }

    // admin-manage-project API call
    getCreateUser(body:any, accessToken:any) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                Authorization: 'Bearer' + ' ' + accessToken,
            }),
            withCredentials: true
        };
        return this.http.post(APIEndpoint + '/users/authenticate/aad', body, this.httpOptions);
    }
}
