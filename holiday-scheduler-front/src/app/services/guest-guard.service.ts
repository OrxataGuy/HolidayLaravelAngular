import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuardService {

constructor(
  private router: Router
) { }

canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) {
  if (
    !localStorage.getItem('access_token')
  ) { return true; }
  this.router.navigateByUrl('/');
  return false;
}
}
