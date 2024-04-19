import { Directive, ElementRef, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appAdjustFontSize]',
})
export class AdjustFontSizeDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

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
