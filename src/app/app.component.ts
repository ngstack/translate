import { Component, OnInit } from '@angular/core';
import { TitleService } from '@ngstack/translate';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private titleService: TitleService) {}

  ngOnInit() {
    this.titleService.setTitle('APP.TITLE');
  }
}
