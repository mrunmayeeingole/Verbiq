import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSubmitComponent } from './last-submit.component';

describe('LastSubmitComponent', () => {
  let component: LastSubmitComponent;
  let fixture: ComponentFixture<LastSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
