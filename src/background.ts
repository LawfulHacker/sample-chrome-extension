let url = '';
let chromeBookmark = {};
let revengeBookmark = {};

import { ReflectiveInjector } from '@angular/core';
import { Bookmark } from './app/bookmark';
import { BookmarkService } from './app/bookmark.service';
import { DatabaseService } from './app/database.service';

let injector = ReflectiveInjector.resolveAndCreate([BookmarkService, DatabaseService]);
let bookmarkService = injector.get(BookmarkService);
window['bookmarkService'] = bookmarkService;

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  url = tab.url;
  chromeBookmark = {};
  revengeBookmark = {};
  chrome.bookmarks.search({ url: tab.url }, function (node) {
    if (node.length >= 1) {
      chromeBookmark = node[0];
      chrome.browserAction.setTitle({
        tabId: tabId,
        title: 'This item is bookmarked'
      });
      chrome.browserAction.setIcon({
        tabId: tabId,
        path: 'assets/bookmark_on.png'
      });
    }
  });
});

function getParentTitles(id: string, callback: Function, titles: Array<string> = []) {
  if (id === '0') {
    callback(titles);
    return;
  }
  chrome.bookmarks.get([id], bookmarkList => {
    let bookmark = bookmarkList[0];
    getParentTitles(bookmark.parentId, callback, [...titles, bookmark.title]);
  });
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.bookmarks.search({}, function (node) {
    node.forEach(b => {
      if (b.url) {
        getParentTitles(b.parentId, titles => bookmarkService.add(new Bookmark(b.url, b.title, titles)));
      }
    });
  });
});