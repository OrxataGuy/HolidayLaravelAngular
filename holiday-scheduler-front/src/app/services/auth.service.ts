import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 authUrl = 'http://localhost:8000/oauth/token';
 apiUrl = 'http://localhost:8000/api';
 options: any;

 constructor(
   private http: HttpClient
 ) {
   this.options = {
     headers: new HttpHeaders({
       Accept: 'application/json',
       'Content-Type': 'application/json',
       Authorization: 'Bearer ' + localStorage.getItem('access_token')
     })
   };
 }

 login(e: string, p: string) {
   return this.http.post(this.authUrl, {
     grant_type: 'password',
     client_id: '2',
     client_secret: 'PASSPORT_CLIENT_2',
     username: e,
     password: p,
     scope: ''
   }, this.options);
 }

 logout() {
  console.log(this.options);
  localStorage.setItem('access_token', '')
   return this.http.get(this.apiUrl + '/token/revoke', this.options);
 }
}
