# 🔮 Pixel Medic

**AI-powered UI triage that diagnoses design ailments and prescribes code fixes**

PixelMedic is a modern Angular application powered by Google Gemini AI that analyzes screenshots of your UI and instantly highlights layout, accessibility, and design issues. It explains what's wrong, why it matters, and generates ready-to-use HTML, CSS, and Angular code fixes.

![Angular](https://img.shields.io/badge/Angular-20+-dd0031?style=flat-square&logo=angular)
![Gemini](https://img.shields.io/badge/Gemini-3.0-4285f4?style=flat-square&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📸 **Screenshot Upload** | Drag & drop or click to upload PNG, JPG, WebP (up to 10MB) |
| 🤖 **AI Analysis** | gemini-3-pro-preview scans for layout, accessibility & design issues |
| 🎯 **Visual Annotations** | Clickable markers highlight issues directly on your screenshot |
| 📊 **Quality Score** | Overall UI rating from 0-100 with visual ring indicator |
| 🔧 **Code Fixes** | Ready-to-use HTML, CSS, and Angular patches with copy button |
| ♿ **Accessibility First** | Built with WCAG AA compliance throughout |

### Issue Severity Levels

- 🔴 **Critical** — Must fix: accessibility blockers, major layout breaks
- 🟡 **Warning** — Should fix: usability concerns, design inconsistencies  
- 🔵 **Suggestion** — Nice to have: optimization opportunities

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Google AI Studio API key ([get one free](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone or download the project
cd pixelmedic

# Install dependencies
npm install

# Start development server
npm start
```

Open http://localhost:4200 and click **"Add API Key"** to configure your Gemini key.

---

## 📁 Project Structure

```
ui-debugger/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── image-upload.component.ts      # Drag & drop file upload
│   │   │   ├── annotated-image.component.ts   # Screenshot with issue overlays
│   │   │   ├── issue-panel.component.ts       # Expandable issue cards with code
│   │   │   ├── score-display.component.ts     # Circular score meter
│   │   │   ├── api-key-modal.component.ts     # API key configuration modal
│   │   │   └── loading-spinner.component.ts   # Analysis loading state
│   │   ├── services/
│   │   │   └── gemini.service.ts              # Gemini AI integration
│   │   └── app.component.ts                   # Main application shell
│   ├── styles.css                             # Global styles & CSS variables
│   ├── index.html                             # HTML entry point
│   └── main.ts                                # Application bootstrap
├── angular.json                               # Angular CLI configuration
├── tsconfig.json                              # TypeScript configuration
├── tsconfig.app.json                          # App-specific TS config
└── package.json                               # Dependencies & scripts
```

---

## Angular Features & Best Practices

This project showcases modern Angular 19+ patterns and best practices. Below is a comprehensive breakdown of every Angular feature used.

### 1. Standalone Components

All components are standalone (the default in Angular 19+), eliminating the need for NgModules.

```typescript

@Component({
  selector: 'app-image-upload',
  template: `...`,
  styles: `...`,
})
export class ImageUploadComponent { }
```

**Why?** Standalone components simplify the mental model, reduce boilerplate, and enable better tree-shaking.

---

### 2. Signals for State Management

Signals provide fine-grained reactivity without RxJS complexity for synchronous state.

```typescript
protected readonly isDragging = signal(false);
protected readonly previewUrl = signal<string | null>(null);

@if (previewUrl()) {
  <img [src]="previewUrl()" />
}

this.isDragging.set(true);
this.previewUrl.update(url => url ? processUrl(url) : null);
```

**Files using signals:**
- `gemini.service.ts` — `apiKey`, `isAnalyzing`, `error`, `lastResult`
- `app.component.ts` — `showApiKeyModal`, `currentImage`, `analysisResult`, `selectedIssueId`, `issueFilter`
- `image-upload.component.ts` — `isDragging`, `previewUrl`
- `issue-panel.component.ts` — `activeTab`, `copied`
- `api-key-modal.component.ts` — `showKey`

---

### 3. Computed Signals for Derived State

`computed()` creates read-only signals that automatically update when dependencies change.

```typescript
protected readonly criticalCount = computed(() => {
  return this.analysisResult()?.issues.filter(i => i.severity === 'critical').length ?? 0;
});

protected readonly filteredIssues = computed(() => {
  const result = this.analysisResult();
  if (!result) return [];
  
  const filter = this.issueFilter();
  if (filter === 'all') return result.issues;
  return result.issues.filter(i => i.severity === filter);
});

private genAI = computed(() => {
  const key = this.apiKey();
  return key ? new GoogleGenAI({ apiKey: key }) : null;
});

readonly isConfigured = computed(() => !!this.apiKey());
```

**Why?** Computed signals are memoized and only recalculate when their dependencies actually change, providing optimal performance.

---

### 4. Input Signals with `input()`

The `input()` function replaces the `@Input()` decorator with a signal-based API.

```typescript
readonly imageUrl = input.required<string>();
readonly issue = input.required<UIIssue>();

readonly issues = input<UIIssue[]>([]);
readonly isSelected = input(false);
readonly selectedIssueId = input<string | null>(null);

<img [src]="imageUrl()" />

@if (isSelected()) {
  <div class="expanded-content">...</div>
}
```

**Why?** Input signals integrate with Angular's reactivity system, enabling computed values based on inputs and better change detection.

---

### 5. Output with `output()`

The `output()` function replaces the `@Output()` decorator.

```typescript
readonly imageSelected = output<string>();
readonly issueSelected = output<string>();
readonly toggleClick = output<void>();
readonly apiKeySubmit = output<string>();
readonly close = output<void>();

this.imageSelected.emit(base64String);
this.toggleClick.emit();

<app-image-upload (imageSelected)="onImageSelected($event)" />
<app-issue-panel (toggleClick)="toggleIssue(issue.id)" />
```

---

**Why?** OnPush components only re-render when:
- Input references change
- Signals they read are updated
- Events originate from the component
- Async pipe emits

This dramatically reduces change detection cycles.

---

### 6. Native Control Flow (`@if`, `@for`, `@switch`)

Modern template syntax replaces structural directives.

```typescript
@if (previewUrl()) {
  <img [src]="previewUrl()" />
} @else {
  <div class="upload-prompt">Drop your screenshot here</div>
}

@for (issue of filteredIssues(); track issue.id; let i = $index) {
  <app-issue-panel [issue]="issue" />
} @empty {
  <p>No issues found.</p>
}

@switch (issue().severity) {
  @case ('critical') {
    <svg><!-- critical icon --></svg>
  }
  @case ('warning') {
    <svg><!-- warning icon --></svg>
  }
  @default {
    <svg><!-- info icon --></svg>
  }
}
```

**Why?** Native control flow is:
- More performant (no directive overhead)
- Better for type inference
- Cleaner syntax with built-in `@empty` blocks

---

### 7. `viewChild()` Signal Query

Signal-based alternative to `@ViewChild()`.

```typescript
private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
private readonly apiKeyInput = viewChild<ElementRef<HTMLInputElement>>('apiKeyInput');

protected triggerFileInput(): void {
  this.fileInput()?.nativeElement.click();
}


<input #fileInput type="file" />
```

**Why?** Signal queries integrate with the reactivity system and provide proper typing.

---

### 8. `inject()` Function

Dependency injection without constructor parameters.

```typescript
@Component({ /* ... */ })
export class AppComponent {
  protected readonly gemini = inject(GeminiService);
}
```

**Why?** `inject()` enables:
- Cleaner code without constructor boilerplate
- Easier testing and mocking
- Use in functions outside classes (guards, resolvers)

---

### 9. `afterNextRender()` Lifecycle Hook

Execute code after the component renders in the browser.

```typescript
constructor() {
  afterNextRender(() => {
    this.apiKeyInput()?.nativeElement.focus();
  });
}
```

**Why?** `afterNextRender()` is SSR-safe and guarantees the DOM is ready, unlike `ngAfterViewInit` which runs during server rendering.

---

### 10. Host Bindings in Decorator

Host element configuration without `@HostBinding` / `@HostListener`.

```typescript
@Component({
  selector: 'app-image-upload',
  host: {
    'class': 'upload-container',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class ImageUploadComponent {
  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }
}
```

```typescript
@Component({
  selector: 'app-api-key-modal',
  host: {
    'class': 'modal-backdrop',
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'api-key-title',
    '(click)': 'onBackdropClick($event)',
    '(keydown.escape)': 'close.emit()',
  },
})
```

**Why?** Centralizes host configuration in one place, making it easier to see all host interactions at a glance.

---

### 11. Reactive Forms

Template-driven forms with `FormsModule` for simple cases.

```typescript
@Component({
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        [(ngModel)]="apiKey"
        name="apiKey"
        required
      />
      <button type="submit" [disabled]="!apiKey.trim()">
        Save
      </button>
    </form>
  `,
})
export class ApiKeyModalComponent {
  protected apiKey = '';
  
  protected onSubmit(): void {
    if (this.apiKey.trim()) {
      this.apiKeySubmit.emit(this.apiKey.trim());
    }
  }
}
```

---

### 12. Singleton Services with `providedIn: 'root'`

Services are automatically singleton and tree-shakeable.

```typescript
@Injectable({ providedIn: 'root' })
export class GeminiService {
  private apiKey = signal<string>('');
  }
```

---

### 13. Inline Templates & Styles

Small-to-medium components use inline templates for colocation.

```typescript
@Component({
  selector: 'app-loading-spinner',
  template: `
    <div class="loading-container" role="status">
      <div class="spinner">...</div>
      <span>Analyzing your UI...</span>
    </div>
  `,
  styles: `
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    /* ... */
  `,
})
```

**Why?** Keeps related code together, reduces file count, and makes components self-contained.

---

### 14. Strict TypeScript Configuration

The project uses strict TypeScript settings for maximum type safety.

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "angularCompilerOptions": {
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

---

### 15. Class Bindings (No `ngClass`)

Direct class bindings instead of the `ngClass` directive.

```typescript
<div [class.dragging]="isDragging()">

<button
  [class.critical]="issue().severity === 'critical'"
  [class.warning]="issue().severity === 'warning'"
  [class.selected]="selectedIssueId() === issue.id"
>

<div [class]="scoreClass()">
```

---

### 16. Style Bindings (No `ngStyle`)

Direct style bindings for dynamic values.

```typescript
<button
  class="annotation-marker"
  [style.left.%]="issue.location.x"
  [style.top.%]="issue.location.y"
  [style.width.%]="issue.location.width"
  [style.height.%]="issue.location.height"
>

<circle
  [style.stroke-dasharray]="circumference"
  [style.stroke-dashoffset]="dashOffset()"
/>
```

---

### 17. Attribute Bindings for Accessibility

Dynamic ARIA attributes for screen readers.

```typescript
<button [attr.aria-label]="showKey() ? 'Hide API key' : 'Show API key'">

<button
  [attr.aria-expanded]="isSelected()"
  [attr.aria-pressed]="issueFilter() === 'critical'"
  [attr.aria-controls]="'issue-content-' + issue().id"
>

<div
  role="meter"
  [attr.aria-valuenow]="score()"
  aria-valuemin="0"
  aria-valuemax="100"
>
```

---

## ♿ Accessibility Features

| Feature | Implementation |
|---------|----------------|
| **Keyboard Navigation** | All interactive elements are focusable and operable via keyboard |
| **Focus Management** | Modal traps focus, auto-focuses input on open |
| **ARIA Labels** | Descriptive labels for icons, buttons, regions |
| **ARIA Roles** | `dialog`, `tablist`, `tab`, `tabpanel`, `meter`, `status`, `alert` |
| **Live Regions** | Loading states announced to screen readers |
| **Color Contrast** | WCAG AA compliant color combinations |
| **Focus Indicators** | Visible 2px outline on `:focus-visible` |
| **Reduced Motion** | Respects `prefers-reduced-motion` |
| **High Contrast** | Adjusts for `prefers-contrast: high` |

---

## 🎨 Theming

Customize the look by editing CSS variables in `src/styles.css`:

```css
:root {
  --bg-primary: #0d0d14;
  --surface-elevated: #1a1a24;
    --accent-color: #6366f1;
  --accent-hover: #818cf8;
    --success-color: #22c55e;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #3b82f6;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;
}
```

---

## 🔧 Customizing the AI Analysis

Edit the `ANALYSIS_PROMPT` in `src/app/services/gemini.service.ts` to customize what Gemini looks for:

```typescript
const ANALYSIS_PROMPT = `You are an expert UI/UX reviewer...

// Add custom rules:
4. **Brand Compliance**: Check if colors match brand guidelines
5. **Performance**: Identify heavy images or complex layouts

// Modify severity criteria
// Change output format
// Add domain-specific checks
`;
```

---

## 📦 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@angular/core` | ^19.0.0 | Angular framework |
| `@angular/forms` | ^19.0.0 | Form handling |
| `@google/genai` | ^0.7.0 | Gemini AI SDK |
| `rxjs` | ~7.8.0 | Reactive extensions |
| `zone.js` | ~0.15.0 | Change detection |
| `typescript` | ~5.6.0 | Language |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT © 2024

---

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for the multimodal AI capabilities
- [Angular Team](https://angular.dev/) for the incredible framework

---

**Built with 💜 using Angular Signals & Gemini AI**
