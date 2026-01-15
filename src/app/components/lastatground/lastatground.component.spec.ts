import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastatgroundComponent } from './lastatground.component';

describe('LastatgroundComponent', () => {
  let component: LastatgroundComponent;
  let fixture: ComponentFixture<LastatgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastatgroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastatgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
