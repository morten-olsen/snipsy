import snippetManager from '../manager';

export default () => {
  const globalConfig = require(snippetManager.configPath);
  const packages = Object.keys(globalConfig.snippets);
  packages.map(async name => {
    const pkg = globalConfig.snippets[name];
    const url = pkg.url;
    const installer = await snippetManager.createInstaller(url);
    await installer.install(pkg.settings);
  });
}
