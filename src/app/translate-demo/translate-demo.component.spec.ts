import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateDemoComponent } from './translate-demo.component';
import { TranslateModule } from '@ngstack/translate';
import { CustomTranslatePipe } from './custom-translate.pipe';
import { HttpClientModule } from '@angular/common/http';

describe('TranslateDemoComponent', () => {
  let component: TranslateDemoComponent;
  let fixture: ComponentFixture<TranslateDemoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [CustomTranslatePipe, TranslateDemoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslateDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
