import { EmagitechprototypePage } from './app.po';

describe('emagitechprototype App', () => {
  let page: EmagitechprototypePage;

  beforeEach(() => {
    page = new EmagitechprototypePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
