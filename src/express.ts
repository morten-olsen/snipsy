import * as express from 'express';
import snippetManager from './manager';

const app = express();

app.use((req, res: any, next) => {
  res.getSnippet = () => {
    return snippetManager.getWebSnippet();
  };

  next();
});

app.get('/snippet-manager/snippet/:name/:hash', async (req, res) => {
  const { name, hash } = req.params;
  const path = await snippetManager.getPath(name, hash);
  if (path) {
    res.sendFile(path);
  }
});

app.post('/snippet-manager/webhook/:name', async (req, res) => {
  const { name } = req.params;
  await snippetManager.updateSnippet(name);
  res.json({
    status: 'started'
  });
});

export default app;
