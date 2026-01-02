import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  inject,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appAdjustFontSize]',
})
export class AdjustFontSizeDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngAfterViewInit() {
    let fontSize = 40;
    this.renderer.setStyle(this.el.nativeElement, 'font-size', `${fontSize}px`);

    let teamNameSpanElementWidth = this.el.nativeElement.offsetWidth;
    let teamNameElementWidth = this.el.nativeElement.parentElement.offsetWidth;

    console.log('SpanWidth', teamNameElementWidth);
    console.log('NameWidth', teamNameElementWidth);
    console.log('FontSize', fontSize);

    while (teamNameSpanElementWidth >= teamNameElementWidth && fontSize > 10) {
      fontSize--;
      this.renderer.setStyle(
        this.el.nativeElement,
        'font-size',
        `${fontSize}px`,
      );
      teamNameSpanElementWidth = this.el.nativeElement.offsetWidth;
      teamNameElementWidth = this.el.nativeElement.parentElement.offsetWidth;

      console.log('SpanWidth', teamNameElementWidth);
      console.log('NameWidth', teamNameElementWidth);
      console.log('FontSize', fontSize);
    }
  }
}
