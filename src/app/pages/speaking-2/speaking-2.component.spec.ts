import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Speaking2Component } from './speaking-2.component';

describe('Speaking2Component', () => {
  let component: Speaking2Component;
  let fixture: ComponentFixture<Speaking2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Speaking2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Speaking2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
