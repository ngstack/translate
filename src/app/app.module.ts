import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngstack/translate';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateDemoComponent } from './translate-demo/translate-demo.component';
import { CustomTranslatePipe } from './translate-demo/custom-translate.pipe';

const routes: Route[] = [
  {
    path: 'translate',
    component: TranslateDemoComponent,
  },
  {
    path: 'translate-lazy',
    loadChildren: () =>
      import('src/app/translate-lazy-demo/translate-lazy-demo.module').then(
        (m) => m.TranslateLazyDemoModule
      ),
  },
];

export function setupTranslateService(service: TranslateService) {
  return () => service.load();
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    TranslateModule.forRoot()
  ],
  declarations: [AppComponent, TranslateDemoComponent, CustomTranslatePipe],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: setupTranslateService,
      deps: [TranslateService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
