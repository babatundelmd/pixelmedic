import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotatedImage } from './annotated-image';

describe('AnnotatedImage', () => {
  let component: AnnotatedImage;
  let fixture: ComponentFixture<AnnotatedImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnotatedImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotatedImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
