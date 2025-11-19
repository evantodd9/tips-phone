import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTotalsComponent } from './round-totals.component';

describe('RoundTotalsComponent', () => {
  let component: RoundTotalsComponent;
  let fixture: ComponentFixture<RoundTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundTotalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
