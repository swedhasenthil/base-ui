import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProjectOrchListApisComponent } from './admin-project-orch-list-apis.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PrettyjsonPipe } from '../../../prettyjson.pipe';

describe('AdminProjectOrchListApisComponent', () => {
  let component: AdminProjectOrchListApisComponent;
  let fixture: ComponentFixture<AdminProjectOrchListApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProjectOrchListApisComponent,PrettyjsonPipe ],
      imports: [HttpClientTestingModule,        
      ],
      providers:[
        
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProjectOrchListApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
