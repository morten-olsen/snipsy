import Snippet from '../src/snippet';
import TestFS from './testfs';
import { expect } from 'chai';

describe('snippet', () => {
  let fs: TestFS;

  beforeEach(() => {
    fs = new TestFS();
  });

  it ('should be able to parse snippet', async () => {
    fs.addJSON('snippets.json', {
      snippets: {
        test: {
          settings: {
            hello: 'world',
          },
        },
      },
    });
    fs.addJSON('snippets/test/package.json', {
      name: 'test',
      resources: {
        hello: {
          url: 'https://gist.githubusercontent.com/morten-olsen/da4596a115f9afd93fc1686c5460b7dd/raw/3b2985fe50b20c3bde66e4bbae33a2b695c17d9f/validation.txt',
        },
      },
      snippet: 'hello {{settings.hello}} {{resources.hello}}',
    });
    const snippet = new Snippet('test', fs);
    await snippet.ensureReady();
    const resourceByHash = await snippet.getResourceByHash('9bc34549d565d9505b287de0cd20ac77be1d3f2c');
    expect(resourceByHash).to.exist
    if (resourceByHash) {
      expect(resourceByHash.name).to.be.equal('hello');
    }
    const resourceByName = await snippet.getResource('hello');
    expect(resourceByName).to.exist
    if (resourceByName) {
      expect(resourceByName.name).to.be.equal('hello');
    }
    expect(snippet.getHash('hello')).to.be.equal('9bc34549d565d9505b287de0cd20ac77be1d3f2c');
    expect(snippet.getSnippet()).to.be.equal('hello world /snippet-manager/snippet/test/9bc34549d565d9505b287de0cd20ac77be1d3f2c');
  });
});
