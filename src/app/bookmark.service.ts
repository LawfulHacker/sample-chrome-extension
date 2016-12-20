import { Injectable } from '@angular/core';

import { DatabaseService } from './database.service';
import { Bookmark } from './bookmark';

import { UUID } from 'angular2-uuid';

@Injectable()
export class BookmarkService {
  constructor(private database: DatabaseService) {
  }

  async add(bookmark: Bookmark): Promise<Bookmark> {
    let db = await this.database.getDatabase();
    window['db'] = db;
    let schema = db.getSchema();
    let bookmarkSchema = <any> schema.table('Bookmark');
    let bookmarkTagSchema = <any> schema.table('BookmarkTag');
    let tagSchema = <any> schema.table('Tag');

    let row = bookmarkSchema.createRow(bookmark);
    let rows = await db.insert().into(bookmarkSchema).values([row]).exec();
    let bookmarkId = rows[0]['id'];
    for (let tag of bookmark.tags) {
      let tagRows = await db.select(tagSchema.id).from(tagSchema).where(tagSchema.name.eq(tag)).exec();
      let tagId;
      if (tagRows.length > 0) {
        tagId = tagRows[0]['id'];
      } else {
        let insertedRows = await db.insert().into(tagSchema).values([tagSchema.createRow({ id: UUID.UUID(), name: tag })]).exec();
        tagId = insertedRows[0]['id'];
      }
      await db.insert().into(bookmarkTagSchema)
        .values([
          bookmarkTagSchema.createRow({
            bookmarkId: bookmarkId,
            tagId: tagId
          })
        ])
        .exec();
    }
    return bookmark;
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
