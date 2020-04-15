import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { TranslateDirective } from './translate.directive';
import { By } from '@angular/platform-browser';
import { TranslateService } from './translate.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  template: `
    <div id="case1" [translate]="message"></div>
    <div id="case2" translate="key1"></div>
    <div
      id="case3"
      [translate]="'formatted'"
      [translateParams]="{ name: 'Bob' }"
    ></div>
    <div id="case4" [translate]></div>
  `,
})
class TestComponent {
  message = 'message1';
}

describe('TranslateDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [TestComponent, TranslateDirective],
      providers: [TranslateService],
    });

    translate = TestBed.inject(TranslateService);

    translate.use('en', {
      message1: 'hello, world',
      key1: 'hello, there',
      formatted: 'hello, {name}',
    });

    translate.use('ua', {
      message1: '[ua] hello, world',
      key1: '[ua] hello, there',
      formatted: '[ua] hello, {name}',
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should have elements', () => {
    const elements = fixture.debugElement.queryAll(
      By.directive(TranslateDirective)
    );
    expect(elements.length).toBe(4);
  });

  it('should translate with property binding', () => {
    const element = fixture.debugElement.query(By.css('#case1'));

    expect(element).toBeDefined();
    expect(element.nativeElement.innerText).toBe('hello, world');
  });

  it('should translate with plain attribute', () => {
    const element = fixture.debugElement.query(By.css('#case2'));

    expect(element).toBeDefined();
    expect(element.nativeElement.innerText).toBe('hello, there');
  });

  it('should translate with the parameters', () => {
    const element = fixture.debugElement.query(By.css('#case3'));

    expect(element).toBeDefined();
    expect(element.nativeElement.innerText).toBe('hello, Bob');
  });

  it('should update element on language change', (done) => {
    const element = fixture.debugElement.query(By.css('#case1'));

    expect(element).toBeDefined();
    expect(element.nativeElement.innerText).toBe('hello, world');

    translate.activeLang = 'ua';

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(element.nativeElement.innerText).toBe('[ua] hello, world');
      done();
    });
  });

  it('should update element only when key provided', () => {
    const element = fixture.debugElement.query(By.css('#case4'));

    expect(element).toBeDefined();
    expect(element.nativeElement.innerText).toBe('');
  });

  it('should update only when dom element present', () => {
    spyOn(translate, 'get').and.stub();

    const directive = new TranslateDirective(
      <any>{ nativeElement: null },
      translate
    );
    directive.key = 'key';
    directive.ngOnInit();

    expect(translate.get).not.toHaveBeenCalled();
  });
});
