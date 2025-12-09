import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePanel } from './issue-panel';

describe('IssuePanel', () => {
  let component: IssuePanel;
  let fixture: ComponentFixture<IssuePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssuePanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssuePanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
