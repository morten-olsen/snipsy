import * as yargs from 'yargs';
import add from './cli/add';
import install from './cli/install';

yargs.command('add', 'add a new snippet', (yargs) => {
  yargs.options('name', {

  });
  return yargs;
});

yargs.command('install', 'install snippets from snippets.json', (yargs) => {
  return yargs;
});

yargs.help();
const [command, ...others] = yargs.argv._;
const commands: {[name: string]: (args: string[], options: any) => void} = {
  add,
  install,
};

commands[command](others, yargs.argv);
