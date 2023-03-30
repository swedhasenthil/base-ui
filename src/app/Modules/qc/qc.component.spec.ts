import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcComponent } from './qc.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('QcComponent', () => {
  let component: QcComponent;
  let fixture: ComponentFixture<QcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcComponent ],
      imports: [HttpClientTestingModule],

    })
    .compileComponents();

    fixture = TestBed.createComponent(QcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
