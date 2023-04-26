import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameMonth,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarMonthViewBeforeRenderEvent,
  CalendarView,
} from 'angular-calendar';
import Swal from 'sweetalert2';
import { EventColor } from 'calendar-utils';
import { JwtHelperService } from '../services/jwt-helper.service';
import { SwalService } from '../services/swal.service';
import { AuthService } from '../services/auth.service';
import { HolidayService } from '../services/holiday.service';
import { Router } from '@angular/router';

const colors: Record<string, EventColor> = {
  chosen: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  validated: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  pending: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'holiday-picker-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  templateUrl: 'holiday-picker.component.html',
})
export class HolidayPickerComponent {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  adminRole: number=2;

  maxDays: number;
  countDays: number;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];



  accessToken: any;
  accessTokenDetails: any;
  activeDayIsOpen: boolean = false;

  constructor(
    jwtHelper: JwtHelperService,
    private swalService: SwalService,
    private modal: NgbModal,
    private authService: AuthService,
    private router: Router,
    private holidayService: HolidayService
    ) {
      this.maxDays = 22;
      this.countDays = 0;
      this.accessToken = localStorage.getItem('access_token');
      this.accessTokenDetails = {
        id: jwtHelper.id(),
        name: jwtHelper.name(),
        power: jwtHelper.power()
    };
    console.log(this.accessTokenDetails)
    this.loadEvents();

  }

  loadEvents() : void {
    this.holidayService.listEvents().subscribe((res: any) => {
      res.value.forEach((ev: any) => {
        if(this.accessTokenDetails.power == this.adminRole) {
          if(ev.pending)
            this.addPendingEvent(ev.date, ev.id, ev.user_id, ev.user.name)
          else if(this.accessTokenDetails.id == ev.user_id)
            this.addValidatedEvent(ev.date, ev.id, ev.user_id, ev.user.name)
          else this.addChosenEvent(ev.date, ev.id, ev.user_id, ev.user.name)
        }else{
          if(this.accessTokenDetails.id == ev.user_id) {
            if(ev.pending) {
              this.addPendingEvent(ev.date, ev.id, ev.user_id, ev.user.name)
            }else{
              this.addValidatedEvent(ev.date, ev.id, ev.user_id, ev.user.name)
            }
          } else this.addChosenEvent(ev.date, ev.id, ev.user_id, ev.user.name)
        }
      })
      this.refresh.next();
      console.log("Holidays:", res);
    })
  }

  async dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }) {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      var event = this.getDateEvent(date.toString());
      console.log(event?.meta)

      if(this.checkPast(date.toString())) {
        if(this.checkWeeks(date.toString())) {
          if(this.accessTokenDetails.power == this.adminRole) {
            if (!event) this.addMyPendingEvent(date.toString())
            else {
              if(event.meta.type == 'pending') {
                const {value: userConfirms, dismiss} = await this.swalService.validateHoliday(event.meta.name, date.toString());
                if(userConfirms) this.validateEvent(event);
                else if(dismiss) this.deleteEvent(event);
                this.refresh.next();
              }else{
                const {value: userConfirms, dismiss} = await this.swalService.showUserConfirmDelete(event.meta.name, date.toString(), false);
                if(userConfirms) this.deleteEvent(event)
                this.refresh.next();
              }
            }
          }else{
            if (!event) this.addMyPendingEvent(date.toString())
            else if (event.meta.user === this.accessTokenDetails.id) {
              if(event.meta.type == 'pending')
                this.deleteEvent(event)
              else {
                const {value: userConfirms, dismiss} = await this.swalService.showUserConfirmDelete(event.meta.name, date.toString(), true);
                if(userConfirms) this.deleteEvent(event)
                this.refresh.next();
              }
            }
          }
        }else{
          this.swalService.twoWeeksDialog();
        }
      }else{
        this.swalService.showPastDialog();
      }

    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }

  checkPast(date: string) : boolean {
    if(this.accessTokenDetails.power == this.adminRole) return true;
    if(new Date(date).getTime() - new Date().getTime() > 0) return true;
    return false;
  }

  checkWeeks(date: string) : boolean {
    if(this.accessTokenDetails.power == this.adminRole) return true;
    if(new Date(date).getTime() - (new Date().getTime()+1000 * 60 * 60 * 24 * 14) > 0) return true;
    return false;
  }

  addChosenEvent(date: string, id: number, user: number, name: string): void {
    this.events = [
      ...this.events,
      {
        title: 'Holiday for '+name,
        start: startOfDay(new Date(date)),
        end: endOfDay(new Date(date)),
        color: colors['chosen'] ,
        draggable: false,
        meta: {
          user: user,
          id: id,
          type: 'chosen',
          name: name
        },
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
    this.refresh.next();
  }

  validateEvent(event: CalendarEvent) {
    event.title = "Holiday for "+event.meta.name;
    event.meta.type= 'chosen';
    event.color= colors['chosen'];
    this.holidayService.updateEvent(event.meta.id, this.accessTokenDetails.power, 1).subscribe((res: any) => {
      console.log(res);
    })

  }

  discardEvent(event: CalendarEvent) {
    this.holidayService.deleteEvent(event.meta.id).subscribe((res: any) => console.log(res))
  }

  addPendingEvent(date: string, id: number, user: number, name: string): void {
    if(user == this.accessTokenDetails.id || this.accessTokenDetails.power == this.adminRole) {
      this.countDays += 1;
      this.events = [
        ...this.events,
        {
          title: 'Pending holiday for '+name,
          start: startOfDay(new Date(date)),
          end: endOfDay(new Date(date)),
          color: colors['pending'],
          meta: {
            user: user,
            id: id,
            name: name,
            type: 'pending'
          },
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true,
          },
        },
      ];
      } else this.addChosenEvent(date, id, user, name);
      this.refresh.next();
  }

  async addMyPendingEvent(date: string) {
    if(this.maxDays-this.countDays > 0) {
      this.countDays += 1;
      // DB access
      if(this.accessTokenDetails.power == this.adminRole) {
        this.holidayService.createEvent(date, this.accessTokenDetails.id, this.accessTokenDetails.power).subscribe((res: any) => {
          console.log(res)
          if(res.status == 200)
          {
            this.events = [
            ...this.events,
            {
              title: 'Validated holiday for '+this.accessTokenDetails.name,
              start: startOfDay(new Date(date)),
              end: endOfDay(new Date(date)),
              color: colors['validated'],
              meta: {
                id: res.value.id,
                user: this.accessTokenDetails.id,
                type: 'validated',
                name:  this.accessTokenDetails.name
              },
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            },
          ];
        } else console.log(res)
        this.refresh.next();
         });
      }else{
        this.holidayService.createEvent(date, this.accessTokenDetails.id, this.accessTokenDetails.power).subscribe((res: any) => {
          if(res.status == 200)
          {
            this.events = [
            ...this.events,
            {
              title: 'Holiday for '+this.accessTokenDetails.name,
              start: startOfDay(new Date(date)),
              end: endOfDay(new Date(date)),
              color: colors['pending'],
              meta: {
                user: this.accessTokenDetails.id,
                id: res.value.id,
                name: this.accessTokenDetails.name,
                type: 'pending'
              },
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            },
          ];
        } else console.log(res)
        this.refresh.next();
         });
      }
    } else this.swalService.holidayDaysCountReached();

  }

  addValidatedEvent(date: string, id: number, user: number, name: string): void {
    if(this.maxDays-this.countDays > 0) {
      this.countDays += 1;
        this.events = [
          ...this.events,
          {
            title: 'Validated holiday for '+name,
            start: startOfDay(new Date(date)),
            end: endOfDay(new Date(date)),
            color: colors['validated'] ,
            meta: {
              id: id,
              user: user,
              type: 'validated',
              name: name
            },
            draggable: false,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
          },
        ];

  } else this.swalService.holidayDaysCountReached();
}


  getDateEvent(date: string) {
    return this.events.find(event => event.start.getTime() == startOfDay(new Date(date)).getTime());
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'] ,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    if(eventToDelete.meta.user == this.accessTokenDetails.id) this.countDays -= 1;
    this.events = this.events.filter((event) => event !== eventToDelete);
    this.discardEvent(eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  logout(): void {
    try {
      this.authService.logout()
      .subscribe(() => {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
        location.reload()
      });
    } catch (err) {
      location.reload();
    }
    location.reload();

  }
}
