import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemoPageComponent } from './demo-page.component';
import { TranslateModule } from '@ngstack/translate';
import { HttpClientModule } from '@angular/common/http';

describe('DemoPageComponent', () => {
  let component: DemoPageComponent;
  let fixture: ComponentFixture<DemoPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslateModule.forRoot()],
      declarations: [DemoPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
