import { afterNextRender, Component, ElementRef, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-api-key-modal',
  imports: [FormsModule],
  templateUrl: './api-key-modal.html',
  styleUrl: './api-key-modal.scss',
})
export class ApiKeyModal {
readonly apiKeySubmit = output<string>();
  readonly close = output<void>();

  protected apiKey = '';
  protected readonly showKey = signal(false);

  private readonly apiKeyInput = viewChild<ElementRef<HTMLInputElement>>('apiKeyInput');

  constructor() {
    afterNextRender(() => {
      this.apiKeyInput()?.nativeElement.focus();
    });
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  protected onSubmit(): void {
    const trimmedKey = this.apiKey.trim();
    if (trimmedKey) {
      this.apiKeySubmit.emit(trimmedKey);
    }
  }
}
