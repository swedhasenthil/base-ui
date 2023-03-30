import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewDocumentComponent } from './review-document.component';

describe('ReviewDocumentComponent', () => {
  let component: ReviewDocumentComponent;
  let fixture: ComponentFixture<ReviewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewDocumentComponent ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should be defined document qc',  () => {  
    const document: any = 'test';  
    expect(document).toBeDefined();
  });
});
