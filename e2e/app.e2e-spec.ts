import { GnbPage } from './app.po';

describe('gnb App', () => {
  let page: GnbPage;

  beforeEach(() => {
    page = new GnbPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
