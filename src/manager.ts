import * as  path from 'path';
import * as nativeFS from 'fs';
import Snippet from './snippet';
import IFS from './types/ifs';

export class SnippetManager {
  private _snippets: Snippet[] = [];
  private _fs: IFS;

  constructor(fs: IFS) {
    this._fs = fs;
    if (!fs.existsSync(this.configPath)) {
      fs.writeFileSync(this.configPath, '{"snippets":{}}', 'utf-8');
    }
    const pkg = require(this.configPath);
    const snippets = pkg.snippets;
    const snippetNames = Object.keys(snippets);
    this._snippets = snippetNames.map(name => new Snippet(name, fs));
  }

  public get configPath() {
    return path.join(process.cwd(), 'snippets.json');
  }

  private getSnippet(name: string) {
    return this._snippets.find(s => s.name === name);
  }

  public async updateSnippet(name: string) {
    const snippet = this.getSnippet(name);
    if (snippet) {
      await snippet.update();
    }
  }

  public async updateAllSnippets() {
    await Promise.all(
      this._snippets.map(snippet => snippet.update()),
    );
  }

  public async getPath(name: string, hash: string) {
    const snippet = this.getSnippet(name);
    if (snippet) {
      const resource = await snippet.getResourceByHash(hash);
      await resource.ensureReady();
      return resource.path;
    } else {
      return undefined;
    }
  }

  public async createInstaller(url: string) {
    const installer = await Snippet.createInstaller(url, (snippet: Snippet) => {
      this._snippets.push(snippet);
    }, this._fs);
    return installer;
  }

  public getWebSnippet() {
    return this._snippets.map(snippet => snippet.getSnippet()).join(';\n');
  }
}

export default new SnippetManager(nativeFS);
