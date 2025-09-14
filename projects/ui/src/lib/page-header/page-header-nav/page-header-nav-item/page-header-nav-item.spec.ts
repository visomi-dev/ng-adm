import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageHeaderNavItem } from './page-header-nav-item';

describe('PageHeaderNavItem', () => {
  let component: PageHeaderNavItem;
  let fixture: ComponentFixture<PageHeaderNavItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageHeaderNavItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageHeaderNavItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
