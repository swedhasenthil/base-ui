import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { ManagerService } from '../../manager.service';

import { ManagerTimelineComponent } from './manager-timeline.component';

describe('ManagerTimelineComponent', () => {
  let component: ManagerTimelineComponent;
  let fixture: ComponentFixture<ManagerTimelineComponent>;
  let managerService: ManagerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerTimelineComponent ],
      imports: [HttpClientModule, FormsModule,ReactiveFormsModule],
      providers: [
        ManagerService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerTimelineComponent);
    component = fixture.componentInstance;
    managerService = jasmine.createSpyObj('ManagerService', ['documentDetails']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
