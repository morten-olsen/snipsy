import snippetManager from '../manager';
import * as readline from 'readline-sync';

const add = async (params: string[], args: any) => {
  const [url] = params;
  const installer = await snippetManager.createInstaller(url);
  const settingKeys = installer.getArguments();
  const settings: {[name: string]: string} = {};
  settingKeys.forEach(option => {
    const input = readline.question(`${option}: `);
    settings[option] = input;
  });
  await installer.install(settings);
};

export default add;
