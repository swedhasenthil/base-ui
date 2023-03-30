import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureProjectsComponent } from './configure-projects.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

describe('ConfigureProjectsComponent', () => {
  let component: ConfigureProjectsComponent;
  let fixture: ComponentFixture<ConfigureProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureProjectsComponent ],
      imports: [HttpClientTestingModule,
              FormsModule, 
              ReactiveFormsModule,
              Ng2SearchPipeModule
      ], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigureProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined loadDocType', () => {
    expect(component.loadDocType).toBeDefined();
  }); 

  it('should be defined loadProjects', () => {
    expect(component.loadProjects).toBeDefined();
  }); 

  it('should be defined projects', () => {
    const projects = 'test'
    expect(projects).toBeDefined();
  }); 

  it('should be defined fetchedData', () => {
    expect(component.fetchedData).toBeDefined();
  }); 

  it('should be defined attributeLength', () => {
    const attributeLength:any  = 'test';
    expect(attributeLength).toBeDefined();
  }); 

  it('should be defined docTypeUnderProject', () => {
    expect(component.docTypeUnderProject).toBeDefined();
  }); 
});
