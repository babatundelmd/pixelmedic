import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiKeyModal } from './api-key-modal';

describe('ApiKeyModal', () => {
  let component: ApiKeyModal;
  let fixture: ComponentFixture<ApiKeyModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiKeyModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApiKeyModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
