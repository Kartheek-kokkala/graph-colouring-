import express from 'express';
import { createServer as createViteServer } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Python Graph Coloring API Endpoint
  // Runs the actual python3 script directly on the system
  app.post('/api/color', (req, res) => {
    try {
      const payload = JSON.stringify(req.body);
      const pythonScriptPath = path.join(__dirname, 'graph_coloring.py');
      const pythonProcess = spawn('python3', [pythonScriptPath, '--json', payload]);

      let outputData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error('Python error:', errorData);
          return res.status(500).json({
            status: 'error',
            message: errorData || `Python exited with code ${code}`,
          });
        }
        try {
          const jsonResult = JSON.parse(outputData);
          return res.json(jsonResult);
        } catch (err: any) {
          console.error('JSON parse error on python output:', outputData);
          return res.status(500).json({
            status: 'error',
            message: 'Failed to parse Python output: ' + outputData,
          });
        }
      });
    } catch (e: any) {
      console.error('Failed to spawn python process:', e);
      return res.status(500).json({ status: 'error', message: e.message });
    }
  });

  // Check Python Health endpoint
  app.get('/api/python-info', (_req, res) => {
    const pythonProcess = spawn('python3', ['--version']);
    let version = '';
    pythonProcess.stdout.on('data', (d) => (version += d.toString()));
    pythonProcess.stderr.on('data', (d) => (version += d.toString()));
    pythonProcess.on('close', () => {
      res.json({ status: 'ok', python_version: version.trim() || 'Python 3' });
    });
  });

  // Mount Vite development middlewares
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Development Server with Python backend running on port ${PORT}`);
  });
}

startServer();
