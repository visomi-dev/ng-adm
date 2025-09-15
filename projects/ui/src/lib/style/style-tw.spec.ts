import { TestBed } from '@angular/core/testing';

import { StyleTw } from './style-tw';

describe('StyleTw', () => {
  let service: StyleTw;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StyleTw);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
