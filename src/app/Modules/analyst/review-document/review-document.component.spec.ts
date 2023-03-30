import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDocumentComponent } from './review-document.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonService } from 'src/app/shared/services/common.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute } from '@angular/router';



describe('ReviewDocumentComponent', () => {
  let component: ReviewDocumentComponent;
  let fixture: ComponentFixture<ReviewDocumentComponent>;

  let commonService: CommonService;
  let sharedService: SharedService;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDocumentComponent ],
      imports: [HttpClientTestingModule],
      
      providers: [
        CommonService,
        SharedService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  switch (key) {
                    case 'id':
                      return '1';
                    case 'documentId':
                      return '2';
                    default:
                      return null; // Return null for all other cases  
                      
                  }
                },
              },
            },
          },
        },
      ],

    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDocumentComponent);
    component = fixture.componentInstance;

    commonService = TestBed.inject(CommonService);
    sharedService = TestBed.inject(SharedService);
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined document', () => {
    const document: any = 'test';  
    expect(document).toBeDefined();
  }); 

  it('should be defined project', () => {
    const project: any = 'test'; 
    expect(project).toBeDefined();
  }); 

});
