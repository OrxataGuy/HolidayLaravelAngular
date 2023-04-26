import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HolidayPickerComponent } from './holiday-picker.component';

describe('HolidayPickerComponent', () => {
  let component: HolidayPickerComponent;
  let fixture: ComponentFixture<HolidayPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HolidayPickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HolidayPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
