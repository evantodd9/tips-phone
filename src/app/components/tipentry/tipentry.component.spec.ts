import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipentryComponent } from './tipentry.component';

describe('TipentryComponent', () => {
  let component: TipentryComponent;
  let fixture: ComponentFixture<TipentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
