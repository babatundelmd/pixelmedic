import { Component, input, output } from '@angular/core';
import { UIIssue } from '../gemini';

@Component({
  selector: 'app-annotated-image',
  imports: [],
  templateUrl: './annotated-image.html',
  styleUrl: './annotated-image.scss',
})
export class AnnotatedImage {
  readonly imageUrl = input.required<string>();
  readonly issues = input<UIIssue[]>([]);
  readonly selectedIssueId = input<string | null>(null);
  readonly issueSelected = output<string>();
}
