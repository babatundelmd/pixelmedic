import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { environment } from './environments/environment.prod';

export interface UIIssue {
  id: string;
  type: 'layout' | 'accessibility' | 'design' | 'performance';
  severity: 'critical' | 'warning' | 'suggestion';
  title: string;
  description: string;
  whyItMatters: string;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  fix: {
    html?: string;
    css?: string;
    angular?: string;
  };
}

export interface AnalysisResult {
  issues: UIIssue[];
  summary: string;
  overallScore: number;
}

const ANALYSIS_PROMPT = `You are an expert UI/UX reviewer and accessibility specialist. Analyze this screenshot and identify:

1. **Layout Issues**: Alignment problems, spacing inconsistencies, overflow issues, responsive design problems
2. **Accessibility Issues**: Missing alt text indicators, poor contrast, small touch targets, missing focus states, ARIA concerns
3. **Design Issues**: Typography problems, color inconsistencies, visual hierarchy issues, component styling problems

For each issue found, provide:
- A unique ID (issue-1, issue-2, etc.)
- Type (layout, accessibility, design, or performance)
- Severity (critical, warning, or suggestion)
- Clear title
- Detailed description of what's wrong
- Why it matters (impact on users)
- Approximate location as percentage coordinates (x, y, width, height as 0-100 values representing percentage of image)
- Code fix with HTML, CSS, and/or Angular code snippets

Respond ONLY with valid JSON in this exact format:
{
  "issues": [
    {
      "id": "issue-1",
      "type": "accessibility",
      "severity": "critical",
      "title": "Issue title",
      "description": "What's wrong",
      "whyItMatters": "Impact explanation",
      "location": { "x": 10, "y": 20, "width": 30, "height": 15 },
      "fix": {
        "html": "<button aria-label=\\"Close\\">X</button>",
        "css": ".btn { min-height: 44px; }",
        "angular": "@Component({ ... })"
      }
    }
  ],
  "summary": "Brief overall assessment",
  "overallScore": 75
}

Be thorough but practical. Focus on actionable issues. Score from 0-100 where 100 is perfect.`;

@Injectable({ providedIn: 'root' })
export class GeminiService {
  
  private apiKey = signal<string>('');
  private genAI = computed(() => {
    const key = this.apiKey();
    return key ? new GoogleGenAI({ apiKey: key }) : null;
  });

  readonly isConfigured = computed(() => !!this.apiKey());
  readonly isAnalyzing = signal(false);
  readonly error = signal<string | null>(null);
  readonly lastResult = signal<AnalysisResult | null>(null);

  setApiKey(key: string): void {
    this.apiKey.set(key);
    this.error.set(null);
  }

  async analyzeScreenshot(imageBase64: string): Promise<AnalysisResult> {
    const ai = this.genAI();
    if (!ai) {
      throw new Error('API key not configured');
    }

    this.isAnalyzing.set(true);
    this.error.set(null);

    try {
      const base64Data = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: ANALYSIS_PROMPT },
              {
                inlineData: {
                  mimeType: 'image/png',
                  data: base64Data,
                },
              },
            ],
          },
        ],
      });

      const text = response.text ?? '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse analysis response');
      }

      const result: AnalysisResult = JSON.parse(jsonMatch[0]);
      this.lastResult.set(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed';
      this.error.set(message);
      throw err;
    } finally {
      this.isAnalyzing.set(false);
    }
  }
}