import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule } from '@ngstack/translate';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CustomTranslatePipe } from './translate-demo/custom-translate.pipe';

const routes: Route[] = [
  {
    path: 'translate',
    component: TranslateDemoComponent
  },
  {
    path: 'translate-lazy',
    loadChildren:
      'src/app/translate-lazy-demo/translate-lazy-demo.module#TranslateLazyDemoModule'
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    TranslateModule.forRoot({
      activeLang: 'en'
    }),
    MatButtonModule,
    MatSelectModule
  ],
  declarations: [AppComponent, TranslateDemoComponent, CustomTranslatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
