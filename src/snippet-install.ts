import Snippet from './snippet';
import snippetManager from './manager';
import IPkg from './ipkg';
import * as mkdirp from 'mkdirp';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import IFS from './types/ifs';

class SnippetInstall {
  private _pkg: IPkg;
  private _addSnippet: (snippet: Snippet) => void

  constructor(pkg:IPkg, addSnippet: (snippet: Snippet) => void, fs: IFS) {
    this._pkg = pkg;
    this._addSnippet = addSnippet;
  }

  public getArguments() {
    return this._pkg.arguments;
  }

  public install(settings: any) {
    return new Promise((resolve, reject) => {
      const name = this._pkg.name;
      const dirPath = path.join(Snippet.basePath, this._pkg.name);
      rimraf(dirPath, async () => {
        const filePath = path.join(dirPath, 'package.json');
        const globalSettings = require(snippetManager.configPath);
        globalSettings.snippets[name] = settings;
        mkdirp.sync(dirPath);
        fs.writeFileSync(filePath, JSON.stringify(this._pkg, null, '\t'), 'utf-8');
        fs.writeFileSync(snippetManager.configPath, JSON.stringify(globalSettings, null, '\t'), 'utf-8');
        const snippet = new Snippet(name, fs);
        await snippet.ensureReady();
        this._addSnippet(snippet);
        resolve();
      });
    });
  }

  public static async create(url: string, addSnippet: (snippet: Snippet) => void, fs: IFS) {
    const pkg = await Snippet.downloadPkg(url);
    const installer = new SnippetInstall(pkg, addSnippet, fs);
    return installer;
  }
}

export default SnippetInstall;
