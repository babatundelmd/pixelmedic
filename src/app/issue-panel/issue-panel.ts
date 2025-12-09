import { Component, computed, input, output, signal } from '@angular/core';
import { UIIssue } from '../gemini';

@Component({
  selector: 'app-issue-panel',
  imports: [],
  templateUrl: './issue-panel.html',
  styleUrl: './issue-panel.scss',
})
export class IssuePanel {
  readonly issue = input.required<UIIssue>();
  readonly isSelected = input(false);
  readonly toggleClick = output<void>();

  protected readonly activeTab = signal<'html' | 'css' | 'angular'>('html');
  protected readonly copied = signal(false);

  protected readonly hasAnyFix = computed(() => {
    const fix = this.issue().fix;
    return !!(fix.html || fix.css || fix.angular);
  });

  constructor() {
    // Set initial active tab to first available fix
  }

  protected copyCode(): void {
    const fix = this.issue().fix;
    let code = '';

    switch (this.activeTab()) {
      case 'html':
        code = fix.html || '';
        break;
      case 'css':
        code = fix.css || '';
        break;
      case 'angular':
        code = fix.angular || '';
        break;
    }

    if (code) {
      navigator.clipboard.writeText(code).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }
}
