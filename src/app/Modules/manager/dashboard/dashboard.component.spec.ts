import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SharedService } from 'src/app/shared/shared.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ],
      imports: [HttpClientTestingModule], 
      providers: [
        SharedService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call managerMenuChanges on ngOnInit', () => {
    const sharedService = TestBed.inject(SharedService);
    spyOn(sharedService, 'managerMenuChanges');
    
    component.ngOnInit();

    expect(sharedService.managerMenuChanges).toHaveBeenCalled();
  });

});
