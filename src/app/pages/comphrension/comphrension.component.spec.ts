import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComphrensionComponent } from './comphrension.component';

describe('ComphrensionComponent', () => {
  let component: ComphrensionComponent;
  let fixture: ComponentFixture<ComphrensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComphrensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComphrensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
