import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectOrchApisSequenceComponent } from './admin-project-orch-apis-sequence.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('AdminProjectOrchApisSequenceComponent', () => {
  let component: AdminProjectOrchApisSequenceComponent;
  let fixture: ComponentFixture<AdminProjectOrchApisSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProjectOrchApisSequenceComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProjectOrchApisSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
