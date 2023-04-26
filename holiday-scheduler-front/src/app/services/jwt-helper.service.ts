import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtHelperService {

 constructor() { }

private decode(token: string) {
  if (token !== null || token !== undefined) {
    const base64Url = token.split('.')[1];
    if (base64Url === null || base64Url === undefined) {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } else {
    return null;
  }
}

private attr(attribute: string): string {
  const token = localStorage.getItem('access_token');
  if (token === null || token === undefined) {
    return "";
  } else {
    const decoded = this.decode(token);
    return (decoded === null) ? null : decoded[attribute];
  }
}

id(): number {
  return +this.attr('id');
}

name(): string {
  return this.attr('name') as string;
}

power(): string {
  return this.attr('power');
}
}
