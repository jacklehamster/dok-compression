import exportedClasses from "./index";

describe('my test', () => {
  it('some text', () => {
    expect(exportedClasses.Loader).toBeInstanceOf(typeof exportedClasses.Loader);
  });
});