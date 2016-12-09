export class Bookmark {
  url: string;
  title: string;
  tags: Array<string>;

  static fromDoc(doc): Bookmark {
    const bookmark = new Bookmark(
      doc.get('url'),
      doc.get('title'),
      doc.get('tags')
    );
    return bookmark;
  }

  constructor(
    url: string,
    title: string,
    tags: Array<string>) {
    this.url = url;
    this.title = title;
    this.tags = tags;
  }
}
