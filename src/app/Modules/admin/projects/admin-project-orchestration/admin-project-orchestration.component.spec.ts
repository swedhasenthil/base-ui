import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectOrchestrationComponent } from './admin-project-orchestration.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('AdminProjectOrchestrationComponent', () => {
  let component: AdminProjectOrchestrationComponent;
  let fixture: ComponentFixture<AdminProjectOrchestrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProjectOrchestrationComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProjectOrchestrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
