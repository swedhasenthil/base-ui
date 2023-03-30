import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneeFilterComponent } from './assignee-filter.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AssigneeFilterComponent', () => {
  let component: AssigneeFilterComponent;
  let fixture: ComponentFixture<AssigneeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigneeFilterComponent ],
      imports: [HttpClientTestingModule],

    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should have a default selected option', () => {
    expect(component.filterByAssignedTo).toBeDefined();
  });
  
  it('should select a different option', () => {
    component.filterByAssignedTo('Assigned to my team');
    expect(component.filterByAssignedTo).toBeDefined( ); 
  });

  it('should toggle the dropdown when the button is clicked', () => {
    const buttonElement = fixture.nativeElement.querySelector('button');
    buttonElement.click();
    fixture.detectChanges();
    expect(component.assignedTo).toBe('Assigned to my team');
  });


});
