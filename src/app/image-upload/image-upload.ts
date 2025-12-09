import { Component, ElementRef, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.scss',
})
export class ImageUpload {
  readonly imageSelected = output<string>();

  protected readonly isDragging = signal(false);
  protected readonly previewUrl = signal<string | null>(null);

  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  protected triggerFileInput(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.processFile(files[0]);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.processFile(input.files[0]);
    }
  }

  private processFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.previewUrl.set(result);
      this.imageSelected.emit(result);
    };
    reader.readAsDataURL(file);
  }
}
