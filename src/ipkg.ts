interface IResource {
  url: string;
  mimeType: string;
  cacheTime?: number,
};

interface IPkg {
  name: string,
  resources: {[name: string]: IResource},
  snippet: string,
  arguments: string[],
};

export default IPkg;
