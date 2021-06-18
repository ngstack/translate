import { Component } from '@angular/core';
import { TranslateService } from '@ngstack/translate';

@Component({
  selector: 'app-translate-demo',
  templateUrl: './translate-demo.component.html',
  styleUrls: ['./translate-demo.component.css'],
})
export class TranslateDemoComponent {
  constructor(private translate: TranslateService) {}

  changeLang(lang: string) {
    this.translate.activeLang = lang;
  }
}
