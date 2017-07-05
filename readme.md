# Snippet Manager

## Setup

```javascript
import * as express from 'express';
import { middleware, manager } from 'snipsy';

const app = express();

app.use(middleware);

app.get('/', (req, res) => {
  res.end(`
    <html>
      <head>
        <title>Snippet demo</title>
        <script>${manager.getWebSnippet()}</script>
      </head>
  `);
});

const listener = app.listen(3000);
```

## Installing snippets

```bash
$ snipsy add https://gist.githubusercontent.com/morten-olsen/da4596a115f9afd93fc1686c5460b7dd/raw/gtm.json
```

```bash
$ snipsy install
```

## Version control

.gitignore: `/snippets`
