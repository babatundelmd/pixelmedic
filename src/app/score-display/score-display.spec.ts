import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDisplay } from './score-display';

describe('ScoreDisplay', () => {
  let component: ScoreDisplay;
  let fixture: ComponentFixture<ScoreDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreDisplay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
