import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastmeetingComponent } from './lastmeeting.component';

describe('LastmeetingComponent', () => {
  let component: LastmeetingComponent;
  let fixture: ComponentFixture<LastmeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastmeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
