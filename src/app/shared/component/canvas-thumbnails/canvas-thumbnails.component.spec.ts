import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasThumbnailsComponent } from './canvas-thumbnails.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ScrollService } from '../../services/scroll.service';


describe('CanvasThumbnailsComponent', () => {
  let component: CanvasThumbnailsComponent;
  let fixture: ComponentFixture<CanvasThumbnailsComponent>;
  let scrollService: ScrollService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CanvasThumbnailsComponent ],
      imports: [HttpClientTestingModule], 

    })
    .compileComponents();

    fixture = TestBed.createComponent(CanvasThumbnailsComponent);
    component = fixture.componentInstance;
    scrollService = TestBed.inject(ScrollService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be defined getThumbnails', () => {
    expect(component.getThumbnails).toBeDefined();
  }); 

  it('should be defined imageBlobUrl', () => {
    expect(component.imageBlobUrl).toBeDefined();
  }); 

  it('should set the current page index', () => {
    const index = 1;
    spyOn(scrollService, 'setCurrentPage').and.stub();

    component.setindex(index);

    expect(scrollService.setCurrentPage).toHaveBeenCalledWith(index);
    expect(component.currentImageIndex).toEqual(index);
  });

  


});
