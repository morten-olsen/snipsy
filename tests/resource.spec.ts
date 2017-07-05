import Resource from '../src/resource';
import TestFS from './testfs';
import IFS from '../src/types/ifs';
import * as path from 'path';
import { expect } from 'chai';

describe('Resource', () => {
  let fs: TestFS;

  beforeEach(() => {
    fs = new TestFS();
  });

  it('should be able to download resources', async () => {
    const resource = new Resource({
      snippet: 'hello',
      resource: 'test',
      fs,
      mimeType: 'mimetype',
      url: 'https://gist.githubusercontent.com/morten-olsen/da4596a115f9afd93fc1686c5460b7dd/raw/3b2985fe50b20c3bde66e4bbae33a2b695c17d9f/validation.txt',
    });
    await resource.ensureReady();
    const expectedPath = path.join(process.cwd(), 'snippets', 'hello', 'test');
    expect(resource.path).to.be.equal(expectedPath);
    expect(resource.exists).to.be.true;
    expect(resource.mimeType).to.be.equal('mimetype');
    expect(fs.existsSync(expectedPath)).to.be.true;
    expect(fs.readFileSync(expectedPath, 'utf-8')).to.be.equal('test1234');
    expect(resource.getContent()).to.be.equal('test1234');
    expect(resource.getHash()).to.be.equal('9bc34549d565d9505b287de0cd20ac77be1d3f2c')
  });

  it('should be able to read json', async () => {
    const data = {
      hello: 'world'
    };
    fs.addFile('snippets/test/package.json', JSON.stringify(data));
    const resource = new Resource({
      snippet: 'test',
      resource: 'package.json',
      fs,
    });
    expect(resource.name).to.be.equal('package.json');
    expect(resource.exists).to.be.true;
    expect(resource.getJSON()).to.be.eql(data);
  });
})
