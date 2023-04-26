import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {


constructor(
  private router: Router
) { }


canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) {
  if (
    localStorage.getItem('access_token')
  ) { return true; }
  localStorage.removeItem('access_token');
  this.router.navigateByUrl('/login');
  return false;
}
}
