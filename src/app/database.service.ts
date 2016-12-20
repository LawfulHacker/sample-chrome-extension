import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
import * as lf from 'lovefield';

@Injectable()
export class DatabaseService {
  private _db: Promise<lf.Database>;

  constructor() {
    window['lf'] = lf;
    window['mdb'] = this;
    this._db = this.buildSchema();
  }

  getDatabase(): Promise<lf.Database> {
    return this._db;
  }

  buildSchema(): Promise<lf.Database> {
    let builder = this.getSchemaBuilder();
    return builder.connect({
      storeType: lf.schema.DataStoreType.INDEXED_DB
    });
  }

  getSchemaBuilder(): lf.schema.Builder {
    let ds = lf.schema.create('bookmarksdb', 1);
    ds.createTable('Bookmark')
        .addColumn('id', lf.Type.STRING)
        .addColumn('url', lf.Type.STRING)
        .addColumn('title', lf.Type.STRING)
        .addIndex('UK_Bookmark_url', ['url'], false)
        .addPrimaryKey(['id']);
    ds.createTable('Tag')
        .addColumn('id', lf.Type.STRING)
        .addColumn('name', lf.Type.STRING)
        .addIndex('UK_Tag_name', ['name'], true)
        .addPrimaryKey(['id']);
    ds.createTable('BookmarkTag')
        .addColumn('tagId', lf.Type.STRING)
        .addColumn('bookmarkId', lf.Type.STRING)
        .addIndex('UK_BookmarkTag', ['tagId', 'bookmarkId'], true)
        .addForeignKey('FK_TagId', <lf.schema.RawForeignKeySpec> {
          local: 'tagId',
          ref: 'Tag.id'
        })
        .addForeignKey('FK_BookmarkId', <lf.schema.RawForeignKeySpec> {
          local: 'bookmarkId',
          ref: 'Bookmark.id'
        });
    return ds;
  }
}
