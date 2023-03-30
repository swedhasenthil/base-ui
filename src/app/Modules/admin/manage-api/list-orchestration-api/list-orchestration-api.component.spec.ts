import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOrchestrationApiComponent } from './list-orchestration-api.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PrettyjsonPipe } from '../../prettyjson.pipe';


describe('ListOrchestrationApiComponent', () => {
  let component: ListOrchestrationApiComponent;
  let fixture: ComponentFixture<ListOrchestrationApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOrchestrationApiComponent, PrettyjsonPipe ],
      imports: [HttpClientTestingModule], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOrchestrationApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
