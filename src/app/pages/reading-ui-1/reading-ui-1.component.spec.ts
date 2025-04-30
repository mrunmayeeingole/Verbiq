import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingUI1Component } from './reading-ui-1.component';

describe('ReadingUI1Component', () => {
  let component: ReadingUI1Component;
  let fixture: ComponentFixture<ReadingUI1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReadingUI1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingUI1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
