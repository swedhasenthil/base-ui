import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeLandingComponent } from './sme-landing.component';

describe('SmeLandingComponent', () => {
  let component: SmeLandingComponent;
  let fixture: ComponentFixture<SmeLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeLandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmeLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
