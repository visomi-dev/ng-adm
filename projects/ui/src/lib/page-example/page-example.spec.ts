import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageExample } from './page-example';

describe('PageExample', () => {
  let component: PageExample;
  let fixture: ComponentFixture<PageExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
