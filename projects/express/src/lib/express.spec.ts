import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Express } from './express';

describe('Express', () => {
  let component: Express;
  let fixture: ComponentFixture<Express>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Express]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Express);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
