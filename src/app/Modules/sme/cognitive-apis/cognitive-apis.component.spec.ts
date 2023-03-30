import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitiveApisComponent } from './cognitive-apis.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from 'backbone';


describe('CognitiveApisComponent', () => {
  let component: CognitiveApisComponent;
  let fixture: ComponentFixture<CognitiveApisComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ CognitiveApisComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
        { provide: Router, useValue: routerSpy }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(CognitiveApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getModelApis', () => {
    expect(component.getModelApis).toBeDefined();
  }); 

  it('should be defined modelApis', () => {
    const modelApis: any = 'test';  
    expect(modelApis).toBeDefined();
  }); 

  it('should be defined expandData', () => {
    const expandData: any = 'test';  
    expect(expandData).toBeDefined();
  });    

});
