import { UUID } from 'angular2-uuid';

export class Bookmark {
  public id: string;
  constructor(
    public url: string,
    public title: string,
    public tags: Array<string>) {
    this.id = UUID.UUID();
  }
}
