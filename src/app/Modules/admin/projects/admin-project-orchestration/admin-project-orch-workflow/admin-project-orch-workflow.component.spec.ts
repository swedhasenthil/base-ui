import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectOrchWorkflowComponent } from './admin-project-orch-workflow.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

declare var $: any;


describe('AdminProjectOrchWorkflowComponent', () => {
  let component: AdminProjectOrchWorkflowComponent;
  let fixture: ComponentFixture<AdminProjectOrchWorkflowComponent>;

  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ AdminProjectOrchWorkflowComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProjectOrchWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
