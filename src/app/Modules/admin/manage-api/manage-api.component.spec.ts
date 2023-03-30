import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ManageApiComponent } from './manage-api.component';

describe('ManageApiComponent', () => {
  let component: ManageApiComponent;
  let fixture: ComponentFixture<ManageApiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageApiComponent ],
      imports: [HttpClientTestingModule], 
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
