import { TestBed } from '@angular/core/testing';

import { WebserviceInterceptorService } from './webservice-interceptor.service';

describe('WebserviceInterceptorService', () => {
  let service: WebserviceInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebserviceInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
