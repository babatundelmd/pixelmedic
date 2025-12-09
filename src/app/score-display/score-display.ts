import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-score-display',
  imports: [],
  templateUrl: './score-display.html',
  styleUrl: './score-display.scss',
})
export class ScoreDisplay {
  readonly score = input.required<number>();
  readonly summary = input('');

  protected readonly circumference = 2 * Math.PI * 45;

  protected readonly dashOffset = computed(() => {
    const progress = this.score() / 100;
    return this.circumference * (1 - progress);
  });

  protected readonly scoreClass = computed(() => {
    const s = this.score();
    if (s >= 90) return 'excellent';
    if (s >= 70) return 'good';
    if (s >= 50) return 'fair';
    return 'poor';
  });

  protected readonly rating = computed(() => {
    const s = this.score();
    if (s >= 90) return 'Excellent';
    if (s >= 70) return 'Good';
    if (s >= 50) return 'Needs Work';
    return 'Poor';
  });
}
