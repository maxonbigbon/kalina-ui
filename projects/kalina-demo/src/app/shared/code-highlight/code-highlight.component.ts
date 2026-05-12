import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild,
} from '@angular/core';
import Prism from 'prismjs';

import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

@Component({
  selector: 'kn-code-highlight',
  template: `
    <pre [class]="'language-' + language">
      <code #codeEl [class]="'language-' + language" [textContent]="code"></code>
    </pre>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeHighlightComponent implements AfterViewInit, OnChanges {
  @Input() code = '';
  @Input() language: 'typescript' | 'javascript' | 'css' | 'html' = 'typescript';

  @ViewChild('codeEl', { static: true }) private codeEl!: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    this.highlightAsync();
  }

  ngOnChanges(): void {
    this.highlightAsync();
  }

  private highlightAsync(): void {
    queueMicrotask(() => this.highlight());
  }

  private highlight(): void {
    if (!this.codeEl?.nativeElement) return;
    Prism.highlightElement(this.codeEl.nativeElement);
  }
}

