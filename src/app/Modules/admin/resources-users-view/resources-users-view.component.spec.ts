import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesUsersViewComponent } from './resources-users-view.component';

describe('ResourcesUsersViewComponent', () => {
  let component: ResourcesUsersViewComponent;
  let fixture: ComponentFixture<ResourcesUsersViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourcesUsersViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResourcesUsersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
