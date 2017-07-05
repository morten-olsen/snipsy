import * as express from 'express';
import { middleware, manager } from '../src/main';

const app = express();

app.use(middleware);

app.get('/', (req, res) => {
  res.end(`
    <html>
      <head>
        <title>Snippet demo</title>
      </head>
      <body>
        <script>${manager.getWebSnippet()}</script>
      </body>
  `);
});

const listener = app.listen(4001, () => {
  console.log('listening on port', listener.address().port);
});
