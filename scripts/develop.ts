import restify from 'restify';
import { dev } from 'reactus';


async function develop() {
  const engine = dev({
    cwd: process.cwd(),
    basePath: '/',
    clientRoute: '/client'
  });

  const server = restify.createServer();

  // Middleware to handle public, assets, and HMR
  server.pre(async (req, res) => {
    try {
      // Run the engine's HTTP processing for public, assets, and HMR
      await engine.http(req, res);

      // If response headers have already been sent, stop processing
      if (res.headersSent) {
        return; // Proceed to next middleware or route
      }

      // Optionally, modify headers or request properties here before routing
      return; // Proceed to routing if no other logic is handled
    } catch (err) {
      // Catch any errors and handle them, like logging or sending a 500 response
      console.error(err);
      res.send(500, 'Internal Server Error');
    }
  });

  // Define your route handlers (e.g., home and about)
  server.get('/', async (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(await engine.render('@/pages/home', { title: 'Home' }));
  });

  server.get('/about', async (_req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.end(await engine.render('@/pages/about'));
  });

  //catch-all route
  server.on('NotFound', (_req, res, _err, cb) => {
    res.send(404, '404 Not Found');
    return cb();
  });
  // Start the server
  server.listen(3000, () => {
    console.log('Server listening at http://localhost:3000');
  });
}

develop().catch((e) => {
  console.error(e);
  process.exit(1);
});
