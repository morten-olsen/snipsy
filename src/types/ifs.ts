interface FS {
  existsSync: (path: string) => boolean,
  readFileSync: (path: string, encoding: string) => string,
  writeFileSync: (path: string, value: string, encoding: string) => void,
};

export default FS;
