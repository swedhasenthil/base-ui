import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyWorkComponent } from './my-work.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('MyWorkComponent', () => {
  let component: MyWorkComponent;
  let fixture: ComponentFixture<MyWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyWorkComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(MyWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should be defined getSelectedProject', () => {
    expect(component.getSelectedProject).toBeDefined();
  }); 
  
  it('should be defined getSelectedAssignee', () => {
    expect(component.getSelectedAssignee).toBeDefined();
  });  
  it('should be defined getSelectedProject', () => {
    expect(component.getSelectedProject).toBeDefined();
  });
  it('should be defined getSelectedDocumentStatus', () => {
    expect(component.getSelectedDocumentStatus).toBeDefined();
  });


});
