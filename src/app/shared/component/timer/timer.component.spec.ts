import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TimerComponent } from './timer.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('TimerComponent', () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimerComponent ],
      imports: [HttpClientTestingModule], 
      providers:[
        DatePipe
      ] 

    })
    .compileComponents();

    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
  
    fixture.detectChanges();
  });

  it('should create', () => {
  
    expect(component).toBeTruthy();
  });

  it('should be defined startTimer', () => {
    expect(component.startTimer).toBeDefined();
  }); 

  it('should start the timer with the given value', () => {
    const review_time_value = 120;
    component.startTimer(review_time_value);
    expect(component.time.getHours()).toBe(5);
    expect(component.time.getMinutes()).toBe(32);
    expect(component.time.getSeconds()).toBe(0);
  });

  it('should start the timer with default value when no value is given', () => {
    component.startTimer(null);   
    expect(component.time.getSeconds()).toBe(0);
  }); 

});


 