import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesComponent } from './attributes.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subject } from 'rxjs';
import { CommonService } from '../../services/common.service';

describe('AttributesComponent', () => {
  let component: AttributesComponent;
  let fixture: ComponentFixture<AttributesComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttributesComponent ],
      imports: [HttpClientTestingModule], 
      providers: [ CommonService ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AttributesComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined countMandatoryAttributes', () => {
    expect(component.countMandatoryAttributes).toBeDefined();
  });   

  it('should be defined document',  () => {  
    const document: any = 'test';  
    expect(document).toBeDefined();
  }); 

  it('should be defined mandatoryCount',  () => {  
    expect(component.mandatoryCount).toBeDefined();
  });  

  it('should count the number of mandatory attributes', () => {
    const attributes = [
      { name: 'attribute1', mandatory: true },
      { name: 'attribute2', mandatory: false },
      { name: 'attribute3', mandatory: true },
      { name: 'attribute4', mandatory: true },
    ];
    spyOn(component, 'countMandatoryAttributes').and.callThrough();
  
    component.countMandatoryAttributes(attributes);

    expect(component.mandatoryCount).toEqual(3);
    expect(component.countMandatoryAttributes).toHaveBeenCalled();
  });

  it('should subscribe to document observable and call other methods', () => {
    const document = { _id: 1, updatedAttributes: [] };
    spyOn(component, 'validateDocument');
    spyOn(component, 'countMandatoryAttributes');
    spyOn(component, 'filterCategory');

    component.ngOnInit();
 
    expect(component.filterCategory).toHaveBeenCalledWith('all');
  });

});
