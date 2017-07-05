import Resource from './resource';
import IPkg from './ipkg';
import * as path from 'path';
import * as handlebars from 'handlebars';
import SnippetInstall from './snippet-install';
import snippetManager from './manager';
import IFS from './types/ifs';

class Snippet {
  private _resources: Resource[] = [];
  private _pkg: IPkg;
  private _template: any;
  private _settings: any;

  constructor(name: string, fs: IFS) {
    const pkg = new Resource({
      snippet: name,
      resource: 'package.json',
      fs,
    });
    const configPath = path.join(process.cwd(), 'snippets.json');
    let settings = {};
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      const globalSettings = JSON.parse(content);
      settings = globalSettings.snippets[name].settings;
    }

    const _pkg = pkg.getJSON<IPkg>();
    if (_pkg) {
      this._pkg = _pkg;
      const resources = Object.keys(_pkg.resources);
      this._resources = resources.map(resource => {
        const data = _pkg.resources[resource];
        return new Resource({
          snippet: name,
          resource,
          url: data.url,
          cacheTime: data.cacheTime,
          mimeType: data.mimeType,
          settings,
          fs,
        });
      });
      this._template = handlebars.compile(_pkg.snippet);
    };
    this._settings = settings;
  }

  public get name() {
    return this._pkg.name;
  }

  public getResource(name: string) {
    const results = this._resources.filter(
      resource => resource.name === name,
    );
    return results[0];
  }

  public getHash(resourceName: string) {
    const resource = this.getResource(resourceName);
    return resource.getHash();
  }

  public async getResourceByHash(hash: string) {

    const results = this._resources.filter(
      resource => resource.getHash() === hash,
    );
    return results[0];
  }

  public async ensureReady() {
    await Promise.all(
      this._resources.map(resource => resource.ensureReady()),
    );
  }

  public getSnippet() {
    const resources = this._resources.reduce((output, input) => {
      const hash = input.getHash();
      if (hash) {
        output[input.name] = `/snippet-manager/snippet/${this.name}/${hash}`;
      }
      return output;
    }, {} as {[name: string]: string});
    return this._template({
      resources,
      settings: this._settings,
    });
  }

  public static get basePath() {
    return path.join(process.cwd(), 'snippets');
  }

  static async downloadPkg(url: string) {
    const content = await Resource.download(url);
    const pkg = JSON.parse(content) as IPkg;
    return pkg;
  }

  public static async createInstaller(url: string, addSnippet: (snippet: Snippet) => void, fs: IFS) {
    return SnippetInstall.create(url, addSnippet, fs);
  }
}

export default Snippet;
