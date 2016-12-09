import { ChromeExtensionAppPage } from './app.po';

describe('chrome-extension-app App', function() {
  let page: ChromeExtensionAppPage;

  beforeEach(() => {
    page = new ChromeExtensionAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
