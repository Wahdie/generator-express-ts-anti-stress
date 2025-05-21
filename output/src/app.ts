import express from 'express';
import { json } from 'body-parser';
import dotenv from 'dotenv';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import AppRouter from './routes/AppRouter';
import UserRouter from './routes/UserRouter';
import PostRouter from './routes/PostRouter';
import {connectToDB} from './config/database';

dotenv.config();


const app = express();
const port = 3000;

app.use(json());
app.use(express.urlencoded({ extended: true }));


// Test koneksi database saat server start
(async () => {
  try {
    // sequelize.sync({force: true}); // Uncomment this line to force sync the database (drop and recreate tables)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
    await connectToDB(); // Koneksi ke database

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1); // Keluar dari proses jika koneksi gagal
  }
})();



app.use('/app', AppRouter);
app.use('/user', UserRouter);
app.use('/post', PostRouter);
app.use(notFoundHandler);
app.use(errorHandler);  


export default app;