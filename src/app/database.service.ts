import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as RxDB from 'rxdb';
import { RxDatabase } from 'rxdb';

@Injectable()
export class DatabaseService {
  static db$: Observable<RxDatabase>;
  static initialize() {
    RxDB.plugin(require('pouchdb-adapter-idb'));
    let collections = [
      {
        name: 'bookmark',
        schema: RxDB.RxSchema.create(require('./bookmark.schema.json')),
        dbCol: null
      }
    ];
    let database = RxDB.create('bookmarkDB', 'idb', null, true)
      .then(db => {
        window['db'] = db; // write to window for debugging
        const fns = collections.map(col => db.collection(col.name, col.schema));
        return Promise.all(fns)
          .then((cols) => {
            collections.map(col => col.dbCol = cols.shift());
            return db;
          });
      });
     DatabaseService.db$ = Observable.fromPromise(<Promise<RxDatabase>>database);
  }

  get(): Promise<RxDatabase> {
    return DatabaseService.db$.toPromise();
  }
}

DatabaseService.initialize();
