import {
  Injectable,
  EventEmitter,
  Inject,
  InjectionToken,
  Optional
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateSettings } from './translate.settings';

export const TRANSLATE_SETTINGS = new InjectionToken<TranslateSettings>(
  'TRANSLATE_SETTINGS'
);

export interface TranslateParams {
  [key: string]: string | number;
}

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  protected data: { [key: string]: any } = {};
  private _fallbackLang = 'en';
  private _activeLang: string;
  private _translationRoot = 'assets/i18n';

  /**
   * Raised each time active language gets changed.
   */
  activeLangChanged = new EventEmitter<{
    previousValue: string;
    currentValue: string;
  }>();

  /**
   * Toggles debug mode.
   *
   * When in the debug mode, the service automatically prepends active language id to very translated result.
   * That allows to verify that your components support i18n correctly and do not contain hard-coded text.
   */
  debugMode = false;

  /**
   * Disable caching and always download language files.
   *
   * Applies cache busting query parameters to urls, for example: '?v=1522426955882'.
   */
  disableCache = false;

  /**
   * List of supported languages.
   *
   * The service will attempt to load resource files only for given set of languages,
   * and will automatically use fallback language for all unspecified values.
   *
   * By default this property is empty and service is going to probe all language files.
   * Active and Fallback languages are always taken into account even if you do not specify them in the list.
   */
  supportedLangs: string[] = [];

  /**
   * List of extra paths to look for translation files.
   *
   * By default this property is empty.
   * The value of `translationRoot` property is always taken into account.
   */
  translatePaths: string[] = [];

  /**
   * The fallback language to use when a resource string for the active language is not available.
   */
  get fallbackLang(): string {
    return this._fallbackLang;
  }

  set fallbackLang(value: string) {
    this._fallbackLang = value || 'en';
  }

  /**
   * The language to use for the translations.
   */
  get activeLang(): string {
    return this._activeLang;
  }

  set activeLang(value: string) {
    const previousValue = this._activeLang;
    const newValue = value || this.fallbackLang;
    const changed = newValue !== previousValue;

    if (changed) {
      this._activeLang = newValue;
      this.use(newValue).then(() => {
        this.activeLangChanged.next({
          previousValue: previousValue,
          currentValue: newValue
        });
      });
    }
  }

  getBrowserLanguage(): string {
    const [lang /*, locale*/] = navigator.language
      .replace('-', '_')
      .toLowerCase()
      .split('_');
    return lang;
  }

  /**
   * The root path to use when loading default translation files.
   * Defaults to 'assets/i18n'.
   */
  get translationRoot(): string {
    return this._translationRoot;
  }

  set translationRoot(value: string) {
    this._translationRoot = value || 'assets/i18n';
  }

  constructor(
    private http: HttpClient,
    @Optional()
    @Inject(TRANSLATE_SETTINGS)
    settings: TranslateSettings
  ) {
    this.applySettings(settings);
  }

  protected applySettings(settings: TranslateSettings) {
    const {
      debugMode,
      disableCache,
      supportedLangs,
      translatePaths,
      translationRoot,
      activeLang
    } = this;

    const defaults = {
      debugMode,
      disableCache,
      supportedLangs,
      translatePaths,
      translationRoot,
      activeLang,
      ...settings
    };

    this.debugMode = defaults.debugMode;
    this.disableCache = defaults.disableCache;
    this.supportedLangs = defaults.supportedLangs;
    this.translatePaths = defaults.translatePaths;
    this.translationRoot = defaults.translationRoot;
    this._activeLang = defaults.activeLang || this.getBrowserLanguage();
  }

  /**
   * Get translated string
   *
   * @param key Translation key
   * @param [params] Translation parameters
   * @param [lang] Language to use for translation
   * @returns Translated string
   * @memberof TranslateService
   */
  get<T extends string | string[] = string>(
    key: T,
    params?: TranslateParams,
    lang?: string
  ): T {
    if (key) {
      if (Array.isArray(key)) {
        return <T>key.map((value: string) => {
          return this.get(value, params, lang);
        });
      } else {
        let value = this.getValue(lang || this.activeLang, <string>key);
        if (value === key) {
          value = this.getValue(this.fallbackLang, <string>key);
        }
        return <T>this.format(value, params);
      }
    } else {
      return null;
    }
  }

  async load(): Promise<any> {
    await this.use(this.fallbackLang);
    return this.use(this.activeLang);
  }

  /**
   * Load the translation file or use provided data for the given language.
   *
   * @param lang Language name
   * @param [data] Translation data to use
   * @returns Final translation data merged with existing translations
   * @memberof TranslateService
   */
  async use(lang: string, data?: any): Promise<any> {
    if (lang && data) {
      return this.setTranslation(lang, data);
    }

    let translation = this.data[lang];
    if (this.isNotSupported(lang)) {
      translation = this.data[this.fallbackLang];
    }

    if (translation && Object.keys(translation).length > 0) {
      return translation;
    }

    const fileName = `${lang || this.fallbackLang}.json`;
    const filePaths = [this.translationRoot, ...(this.translatePaths || [])];

    for (const path of filePaths) {
      const filePath = `${path}/${fileName}`;
      await this.loadTranslation(lang, filePath);
    }

    return this.data[lang] || {};
  }

  protected loadTranslation(lang: string, path: string): Promise<any> {
    return new Promise<any>((resolve) => {
      if (this.disableCache) {
        path += `?v=${Date.now()}`;
      }

      this.http.get<{}>(path).subscribe(
        (json) => {
          resolve(this.setTranslation(lang, json));
        },
        () => {
          resolve(this.data[lang] || {});
        }
      );
    });
  }

  protected isNotSupported(lang: string): boolean {
    return (
      lang !== this.fallbackLang &&
      lang !== this.activeLang &&
      this.supportedLangs &&
      this.supportedLangs.length > 0 &&
      !(this.supportedLangs.indexOf(lang) >= 0)
    );
  }

  protected getValue(lang: string, key: string): string {
    let data = this.data[lang];
    if (this.isNotSupported(lang)) {
      data = this.data[this.fallbackLang];
    }

    if (!data) {
      return key;
    }

    const keys = key.split('.');
    let propKey = '';

    do {
      propKey += keys.shift();
      const value = data[propKey];
      if (value !== undefined && (typeof value === 'object' || !keys.length)) {
        data = value;
        propKey = '';
      } else if (!keys.length) {
        data = key;
      } else {
        propKey += '.';
      }
    } while (keys.length);

    return data;
  }

  protected setTranslation(lang: string, data: any): any {
    let finalResult = this.data[lang] || {};
    finalResult = this.merge(finalResult, data || {});
    this.data[lang] = finalResult;
    return finalResult;
  }

  protected merge(...translations: any[]): any {
    const result = {};

    translations.forEach((translation) => {
      Object.keys(translation).forEach((key) => {
        if (key in result && Array.isArray(result[key])) {
          result[key] = result[key].concat(translation[key]);
        } else if (key in result && typeof result[key] === 'object') {
          result[key] = this.merge(result[key], translation[key]);
        } else {
          result[key] = translation[key];
        }
      });
    });

    return result;
  }

  protected format(str: string, params: TranslateParams): string {
    let result = str;

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        const template = new RegExp('{' + key + '}', 'gm');

        result = result.replace(template, value.toString());
      });
    }

    if (this.debugMode) {
      result = `[${this.activeLang}] ${result}`;
    }

    return result;
  }
}
