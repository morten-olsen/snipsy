import IFS from '../src/types/ifs';
import * as path from 'path';

class TestFS implements IFS {
  private _files: {[path: string]: string} = {};

  existsSync(path: string) {
    return !!this._files[path];
  }

  readFileSync(path: string, encoding: string) {
    return this._files[path];
  }

  writeFileSync(path: string, value: string, encoding: string) {
    this._files[path] = value;
  }

  public addFile(location: string, content: string) {
    const hddPath = path.join(process.cwd(), location);
    this._files[hddPath] = content;
  }

  public addJSON(location: string, content: any) {
    const hddPath = path.join(process.cwd(), location);
    this._files[hddPath] = JSON.stringify(content);
  }
}

export default TestFS;
