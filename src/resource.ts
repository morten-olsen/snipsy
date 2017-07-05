import * as crypto from 'crypto';
import * as path from 'path';
import Snippet from './snippet';
import * as http from 'https';
import * as handlebars from 'handlebars';
import IFS from './types/ifs';

interface IArgs {
  snippet: string,
  resource: string,
  url?: string,
  cacheTime?: number,
  mimeType?: string,
  settings?: any,
  fs: IFS,
}

class Resource {
  private _hash: string | undefined = undefined;
  private _name: string;
  private _mimeType: string;
  private _snippet: string;
  private _url: string;
  private _cacheTime: number | undefined;
  private _lastUpdate: number = 0;
  private _fs: IFS;

  constructor({
    snippet,
    resource,
    url,
    cacheTime,
    mimeType = 'text',
    settings = {},
    fs,
  }: IArgs) {
    this._fs = fs;
    this._snippet = snippet;
    this._name = resource;
    if (url) {
      const urlTemplate = handlebars.compile(url);
      this._url = urlTemplate(settings);
    }
    this._cacheTime = cacheTime;
    this._mimeType = mimeType;
  }

  public get path(): string {
    return path.join(
      Snippet.basePath,
      this._snippet,
      this._name,
    );
  }

  public get name(): string {
    return this._name;
  }

  public get exists(): boolean {
    return this._fs.existsSync(this.path);
  }

  public get mimeType() {
    return this._mimeType;
  }

  public get isStale() {
    if (!this._cacheTime) {
      return false;
    }
    return this._lastUpdate > (new Date()).getTime() - this._cacheTime;
  }

  public getContent(): string | undefined {
    if (this.exists) {
      return this._fs.readFileSync(this.path, 'utf-8');
    } else {
      return undefined;
    }
  }

  public getJSON<TType>(): TType | undefined {
    const content = this.getContent();
    if (typeof content !== 'undefined') {
      return JSON.parse(content);
    } else {
      return undefined;
    }
  }

  public getHash(): string | undefined{
    if (!this._hash) {
      const content = this.getContent();
      if (typeof content !== 'undefined') {
        const sha = crypto.createHash('sha1');
        sha.update(content);
        this._hash = sha.digest('hex');
      }
    }
    return this._hash;
  }

  public async ensureReady() {
    if (this.exists && !this.isStale) {
      return;
    }
    const resource = await Resource.download(this._url);
    this._fs.writeFileSync(this.path, resource, 'utf-8');
    this._lastUpdate = (new Date()).getTime();
  }

  public static download(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(data);
        });
      });
    });
  }
}

export default Resource;
