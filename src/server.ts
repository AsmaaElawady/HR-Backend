import app from './app';
import { config } from './shared/config/env';
import { connectDB } from './shared/config/db';


const start = async () => {
  await connectDB();
  app.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
}

start();
