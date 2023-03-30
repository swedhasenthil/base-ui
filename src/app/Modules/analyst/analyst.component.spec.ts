import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystComponent } from './analyst.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AnalystComponent', () => {
  let component: AnalystComponent;
  let fixture: ComponentFixture<AnalystComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
