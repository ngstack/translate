import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TRANSLATE_SETTINGS } from './translate.service';
import { TranslatePipe } from './translate.pipe';
import { TitleService } from './title.service';
import { TranslateSettings } from './translate.settings';

@NgModule({
  imports: [CommonModule],
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class TranslateModule {
  static forRoot(settings?: TranslateSettings): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [
        { provide: TRANSLATE_SETTINGS, useValue: settings },
        TranslateService,
        TitleService
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: TranslateModule
    };
  }
}
