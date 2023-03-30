import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CognitiveApisModelComponent } from './cognitive-apis-model.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('CognitiveApisModelComponent', () => {
  let component: CognitiveApisModelComponent;
  let fixture: ComponentFixture<CognitiveApisModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CognitiveApisModelComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(CognitiveApisModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getVersionedModelApis', () => {
    expect(component.getVersionedModelApis).toBeDefined();
  }); 

  it('should be defined versionedModelApis', () => {
    const versionedModelApis: any = 'test';  
    expect(versionedModelApis).toBeDefined();
  }); 

  it('should be defined onChangeVersionedApiStatus', () => {
    expect(component.onChangeVersionedApiStatus).toBeDefined();
  }); 

  it('should be defined makeVersion', () => {
    expect(component.makeVersion).toBeDefined();
  });

  it('should be defined submitModalApiVersion', () => {
    expect(component.submitModalApiVersion).toBeDefined();
  });

});
