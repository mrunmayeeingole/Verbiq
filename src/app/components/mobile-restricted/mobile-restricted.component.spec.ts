import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRestrictedComponent } from './mobile-restricted.component';

describe('MobileRestrictedComponent', () => {
  let component: MobileRestrictedComponent;
  let fixture: ComponentFixture<MobileRestrictedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MobileRestrictedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileRestrictedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
