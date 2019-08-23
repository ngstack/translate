import { Directive, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from './translate.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[translate]'
})
export class TranslateDirective implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();

  @Input('translate')
  key = '';

  @Input()
  translateParams: any = null;

  constructor(private el: ElementRef, private translate: TranslateService) {}

  ngOnInit() {
    this.updateElement();

    this.translate.activeLangChanged
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.updateElement());
  }

  private updateElement() {
    if (this.key) {
      const domElement: HTMLElement = this.el.nativeElement;

      if (domElement) {
        domElement.innerText = this.translate.get(
          this.key,
          this.translateParams
        );
      }
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
}
