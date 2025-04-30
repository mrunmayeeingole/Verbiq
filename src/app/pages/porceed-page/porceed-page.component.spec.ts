import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PorceedPageComponent } from './porceed-page.component';

describe('PorceedPageComponent', () => {
  let component: PorceedPageComponent;
  let fixture: ComponentFixture<PorceedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PorceedPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PorceedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
