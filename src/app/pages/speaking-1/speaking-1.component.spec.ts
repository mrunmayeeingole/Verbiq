import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Speaking1Component } from './speaking-1.component';

describe('Speaking1Component', () => {
  let component: Speaking1Component;
  let fixture: ComponentFixture<Speaking1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Speaking1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Speaking1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
