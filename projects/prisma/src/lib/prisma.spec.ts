import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Prisma } from './prisma';

describe('Prisma', () => {
  let component: Prisma;
  let fixture: ComponentFixture<Prisma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Prisma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Prisma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
