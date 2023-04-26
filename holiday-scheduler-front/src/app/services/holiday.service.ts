import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  resourceUrl = "http://localhost:8000/api/holidays";
  options: any;

  constructor( private http: HttpClient) {
    this.options = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      })
    };
  }

  listEvents() : any
  {
    return this.http.get(this.resourceUrl, this.options);
  }

  createEvent(date: string, user: number, power: number) : any
  {
    return this.http.post(this.resourceUrl, {
      date: date,
      user_id: user,
      power: power
    }, this.options);
  }

  updateEvent(id: number, power: number, validate: number) : any
  {
    return this.http.put(this.resourceUrl+"/"+id, {
      validate: validate,
      power: power
    }, this.options);
  }

  deleteEvent(id: number) : any
  {
    this.options.method = "DELETE";
    this.options.body = {
      id: id
    };
    return this.http.delete(this.resourceUrl+"/"+id, this.options);
  }
}
