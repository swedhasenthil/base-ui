import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasDocumentComponent } from './canvas-document.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('CanvasDocumentComponent', () => {
  let component: CanvasDocumentComponent;
  let fixture: ComponentFixture<CanvasDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasDocumentComponent ],
      imports: [HttpClientTestingModule,BrowserAnimationsModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
