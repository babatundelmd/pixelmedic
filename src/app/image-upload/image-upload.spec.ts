import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUpload } from './image-upload';

describe('ImageUpload', () => {
  let component: ImageUpload;
  let fixture: ComponentFixture<ImageUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageUpload);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
