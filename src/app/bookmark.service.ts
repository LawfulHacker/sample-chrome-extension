import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RxCollection } from 'rxdb';

import { DatabaseService } from './database.service';
import { Bookmark } from './bookmark';

@Injectable()
export class BookmarkService {
  collection$: Observable<RxCollection>;

  constructor(database: DatabaseService) {
    this.collection$ = Observable.fromPromise(
      database.get().then(db => db.collection('bookmark'))
    );
  }

  collection(): Promise<RxCollection> {
    return this.collection$.toPromise();
  }

  add(bookmark: Bookmark): Promise<Bookmark> {
    return this.collection()
      .then(collection => collection.insert(bookmark))
      .then(doc => Bookmark.fromDoc(doc));
  }
}
