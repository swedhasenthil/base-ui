import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { ManageAttributesComponent } from './manage-attributes.component';

describe('ManageAttributesComponent', () => {
  let component: ManageAttributesComponent;
  let fixture: ComponentFixture<ManageAttributesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAttributesComponent ],
      imports: [HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2SearchPipeModule
      ], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectLeftAll function when Available left Attributes button clicked', fakeAsync(() => {
    spyOn(component, 'selectLeftAll');  
    let button = fixture.debugElement.nativeElement.querySelector('.skn-check-input');
    button.click();  
    tick();  
    expect(component.selectLeftAll).toHaveBeenCalled();
  }));

  it('should call selectRightAll function when Available right Attributes button clicked', fakeAsync(() => {
    spyOn(component, 'selectRightAll');  
    let checkbox = fixture.debugElement.nativeElement.querySelector('#isCheckAlls');
    checkbox.click();  
    tick();  
    expect(component.selectRightAll).toHaveBeenCalled();
  }));

  it('should call closeModel when closeModel button clicked', fakeAsync(() => {
    spyOn(component, 'closeModel');  
    let button = fixture.debugElement.nativeElement.querySelector('.modal-close-btn');
    button.click();  
    tick();  
    expect(component.closeModel).toHaveBeenCalled();
  }));

  it('should be defined selectedAttibutes', () => {
    expect(component.selectedAttibutes).toBeDefined();
  }); 

  it('should be defined leftAttributeList', () => {
    expect(component.leftAttributeList).toBeDefined();
  }); 
  
  it('should be defined rightAttributeList', () => {
    expect(component.rightAttributeList).toBeDefined();
  }); 
});
