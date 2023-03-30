import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrchestrationApiComponent } from './edit-orchestration-api.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('EditOrchestrationApiComponent', () => {
  let component: EditOrchestrationApiComponent;
  let fixture: ComponentFixture<EditOrchestrationApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOrchestrationApiComponent ],
      imports: [HttpClientTestingModule],

    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrchestrationApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
