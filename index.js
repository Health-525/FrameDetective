import app from './src/app.js';
import { config, checkConfig } from './src/config/env.js';

checkConfig();

app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});