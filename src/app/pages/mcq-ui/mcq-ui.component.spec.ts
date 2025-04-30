import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MCQUIComponent } from './mcq-ui.component';

describe('MCQUIComponent', () => {
  let component: MCQUIComponent;
  let fixture: ComponentFixture<MCQUIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MCQUIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MCQUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
