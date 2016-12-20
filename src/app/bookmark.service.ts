import { Injectable } from '@angular/core';

import { DatabaseService } from './database.service';
import { Bookmark } from './bookmark';

import { UUID } from 'angular2-uuid';

@Injectable()
export class BookmarkService {
  constructor(private database: DatabaseService) {
  }

  add(bookmark: Bookmark): Promise<Bookmark> {
    return this.database.getDatabase()
      .then(db => {
        window['db'] = db;
        let schema = db.getSchema();
        let bookmarkSchema = <any> schema.table('Bookmark');
        let bookmarkTagSchema = <any> schema.table('BookmarkTag');
        let tagSchema = <any> schema.table('Tag');

        let row = bookmarkSchema.createRow(bookmark);
        return db.insert().into(bookmarkSchema).values([row]).exec()
          .then(rows => rows[0]['id'])
          .then(bookmarkId =>
            Promise.all(
              bookmark.tags.map(tag => {
                return db.select(tagSchema.id).from(tagSchema).where(tagSchema.name.eq(tag)).exec()
                  .then(rows => {
                    if (rows.length > 0) {
                      return rows[0]['id'];
                    }
                    return db.insert().into(tagSchema).values([tagSchema.createRow({ id: UUID.UUID(), name: tag })]).exec()
                      .then(insertedRows => insertedRows[0]['id']);
                  })
                  .then(tagId => db.insert().into(bookmarkTagSchema).values([
                        bookmarkTagSchema.createRow({
                          bookmarkId: bookmarkId,
                          tagId: tagId
                        })
                      ]).exec()
                  );
              })
            )
          );
      });
  }
}
