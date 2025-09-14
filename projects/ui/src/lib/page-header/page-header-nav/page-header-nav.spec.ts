import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderNav } from './page-header-nav';

describe('PageHeaderNav', () => {
  let component: PageHeaderNav;
  let fixture: ComponentFixture<PageHeaderNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeaderNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
