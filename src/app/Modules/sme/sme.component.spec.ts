import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeComponent } from './sme.component';

describe('SmeComponent', () => {
  let component: SmeComponent;
  let fixture: ComponentFixture<SmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
