/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BookmarkService } from './bookmark.service';

describe('BookmarkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BookmarkService]
    });
  });

  it('should ...', inject([BookmarkService], (service: BookmarkService) => {
    expect(service).toBeTruthy();
  }));
});
