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
          .then(bookmarkId => {
            let promise = Promise.resolve();
            bookmark.tags.forEach(tag => {
              promise = promise.then( () => db
                .select(tagSchema.id).from(tagSchema).where(tagSchema.name.eq(tag)).exec()
                .then(rows => {
                  if (rows.length > 0) {
                    return rows[0]['id'];
                  }
                  return db.insert().into(tagSchema).values([tagSchema.createRow({ id: UUID.UUID(), name: tag })]).exec()
                    .then(insertedRows => insertedRows[0]['id']);
                })
                .then(tagId => db
                  .insert().into(bookmarkTagSchema)
                  .values([
                    bookmarkTagSchema.createRow({
                      bookmarkId: bookmarkId,
                      tagId: tagId
                    })
                  ])
                  .exec()
                )
              );
            });
            return promise;
          });
      });
  }
}

/*
mdb.buildSchema().then(db => {
  let schema = db.getSchema();
  let tagSchema = schema.table('Tag');
  let bookmarkTagSchema = schema.table('BookmarkTag');
  let bookmarkSchema = schema.table('Bookmark');
  return db.select(bookmarkSchema.url.as('url'), bookmarkSchema.title.as('title'))
    .from(bookmarkSchema)
    .innerJoin(bookmarkTagSchema, bookmarkSchema.id.eq(bookmarkTagSchema.bookmarkId))
    .innerJoin(tagSchema, tagSchema.id.eq(bookmarkTagSchema.tagId))
    .where(tagSchema.name.eq("Tributos")).exec()
})
.then(rows => rows.forEach(row => console.log(`${row.title} ${row.url}`)))
*/
