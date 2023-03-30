import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DefineRulesComponent } from './define-rules.component';

describe('DefineRulesComponent', () => {
  let component: DefineRulesComponent;
  let fixture: ComponentFixture<DefineRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DefineRulesComponent ],
      imports: [HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule
      ], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefineRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateDocument when Update button clicked', fakeAsync(() => {
    spyOn(component, 'updateDocument');  
    let button = fixture.debugElement.nativeElement.querySelector('.skn-filled-btn');
    button.click();  
    tick();  
    expect(component.updateDocument).toHaveBeenCalled();
  }));

  it('should call onSubmit when submit button clicked', fakeAsync(() => {
    spyOn(component, 'updateDocument');  
    let button = fixture.debugElement.nativeElement.querySelector('.skn-filled-btn');
    button.click();  
    tick();  
    expect(component.updateDocument).toHaveBeenCalled();
  }));

  it('should be defined selectedAttibutes', () => {
    expect(component.selectedAttibutes).toBeDefined();
  }); 

  it('should be defined selectedField', () => {
    expect(component.selectedField).toBeDefined();
  }); 

  it('should be defined updatedDocId', () => {
    expect(component.updatedDocId).toBeDefined();
  });

  it('should be defined finalArr', () => {
    expect(component.finalArr).toBeDefined();
  });

});
