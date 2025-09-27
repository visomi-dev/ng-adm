import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeRenderer } from './node-renderer';

describe('NodeRenderer', () => {
  let component: NodeRenderer;
  let fixture: ComponentFixture<NodeRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodeRenderer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
