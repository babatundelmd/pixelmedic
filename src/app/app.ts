import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GeminiService, AnalysisResult } from './gemini';
import { AnnotatedImage } from './annotated-image/annotated-image';
import { ApiKeyModal } from './api-key-modal/api-key-modal';
import { ImageUpload } from './image-upload/image-upload';
import { IssuePanel } from './issue-panel/issue-panel';
import { LoadingSpinner } from './loading-spinner/loading-spinner';
import { ScoreDisplay } from './score-display/score-display';

@Component({
  selector: 'app-root',
  imports: [
    ImageUpload,
    AnnotatedImage,
    IssuePanel,
    ScoreDisplay,
    ApiKeyModal,
    LoadingSpinner
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pixelmedic');
  protected readonly gemini = inject(GeminiService);

  protected readonly showApiKeyModal = signal(false);
  protected readonly currentImage = signal<string | null>(null);
  protected readonly analysisResult = signal<AnalysisResult | null>(null);
  protected readonly selectedIssueId = signal<string | null>(null);
  protected readonly issueFilter = signal<'all' | 'critical' | 'warning'>('all');

  protected readonly criticalCount = computed(() => {
    return (
      this.analysisResult()?.issues.filter((i) => i.severity === 'critical')
        .length ?? 0
    );
  });

  protected readonly warningCount = computed(() => {
    return (
      this.analysisResult()?.issues.filter((i) => i.severity === 'warning')
        .length ?? 0
    );
  });

  protected readonly filteredIssues = computed(() => {
    const result = this.analysisResult();
    if (!result) return [];

    const filter = this.issueFilter();
    if (filter === 'all') return result.issues;
    return result.issues.filter((i) => i.severity === filter);
  });

  constructor() {
    // Load saved API key from localStorage
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      this.gemini.setApiKey(savedKey);
    }
  }

  protected onApiKeySubmit(key: string): void {
    this.gemini.setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
    this.showApiKeyModal.set(false);
  }

  protected onImageSelected(imageBase64: string): void {
    this.currentImage.set(imageBase64);
    this.analysisResult.set(null);
    this.selectedIssueId.set(null);
    this.issueFilter.set('all');
  }

  protected async analyzeImage(): Promise<void> {
    const image = this.currentImage();
    if (!image) return;

    try {
      const result = await this.gemini.analyzeScreenshot(image);
      this.analysisResult.set(result);

      // Auto-select first critical issue if any
      const firstCritical = result.issues.find((i) => i.severity === 'critical');
      if (firstCritical) {
        this.selectedIssueId.set(firstCritical.id);
      }
    } catch {
      // Error is handled by the service
    }
  }

  protected resetAnalysis(): void {
    this.currentImage.set(null);
    this.analysisResult.set(null);
    this.selectedIssueId.set(null);
    this.issueFilter.set('all');
  }

  protected toggleIssue(issueId: string): void {
    if (this.selectedIssueId() === issueId) {
      this.selectedIssueId.set(null);
    } else {
      this.selectedIssueId.set(issueId);
    }
  }

  protected dismissError(): void {
    this.gemini.error.set(null);
  }
}
