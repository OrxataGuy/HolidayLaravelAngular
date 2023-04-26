import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  constructor() { }
  public showUserConfirmDelete() : Promise<any> {
    return Swal.fire({
      title: 'Hey, wait!',
      text: 'Are you sure that you want to cancel this validated holiday?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Nope',
      showCancelButton: true,
    })
  }

  public validateHoliday(user: string, date: string) : Promise<any> {
    return Swal.fire({
      title: 'Validate holiday',
      text: `Do you want to validate this holiday for ${user} on ${date}?`,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Nope',
      showCancelButton: true,
    })
  }

  public holidayDaysCountReached() : Promise<any> {
    return Swal.fire('Woops!', 'It seems that you have reached the maximum number of holiday days, please try to reorganize your holiday days!', 'error')
  }

  public showPastDialog() : Promise<any> {
    return Swal.fire('Humm...', 'You cannot change the holidays that have already passed!', 'error')
  }

  public twoWeeksDialog() : Promise<any> {
    return Swal.fire('Hey!', 'You need to notify your holidays at least two weeks in advance', 'warning')
  }
}
