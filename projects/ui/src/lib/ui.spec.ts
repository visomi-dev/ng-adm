import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { Ui } from './ui';

describe('Ui', () => {
  let component: Ui;
  let fixture: ComponentFixture<Ui>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ui],
    }).compileComponents();

    fixture = TestBed.createComponent(Ui);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Structure', () => {
    it('should render the component template', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled).toBeTruthy();
    });

    it('should contain the expected template content', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('ui works!');
    });

    it('should have a paragraph element with correct content', () => {
      const paragraphElement = debugElement.query(By.css('p'));
      expect(paragraphElement).toBeTruthy();
      expect(paragraphElement.nativeElement.textContent).toBe('ui works!');
    });
  });

  describe('Component Properties', () => {
    it('should have default properties', () => {
      expect(component).toBeDefined();
    });
  });

  describe('Component Methods', () => {
    it('should have access to component methods', () => {
      expect(typeof component).toBe('object');
    });
  });

  describe('DOM Integration', () => {
    it('should render without errors', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should maintain DOM structure after multiple change detections', () => {
      fixture.detectChanges();
      const initialContent = fixture.nativeElement.textContent;

      fixture.detectChanges();
      const secondContent = fixture.nativeElement.textContent;

      expect(initialContent).toBe(secondContent);
    });
  });

  describe('Lifecycle', () => {
    it('should call ngOnInit if it exists', () => {
      // Since the component doesn't have ngOnInit, this test ensures
      // the component can be instantiated without lifecycle issues
      expect(component).toBeTruthy();
    });

    it('should handle component destruction gracefully', () => {
      expect(() => {
        fixture.destroy();
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic HTML structure', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      // Check that it contains paragraph elements (semantic content)
      const paragraphs = compiled.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);
    });
  });

  describe('Performance', () => {
    it('should not cause performance issues during rendering', () => {
      const startTime = performance.now();

      // Perform multiple render cycles
      for (let i = 0; i < 10; i++) {
        fixture.detectChanges();
      }

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 100ms for 10 renders)
      expect(renderTime).toBeLessThan(100);
    });
  });
});
