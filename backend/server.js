const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const poemRoutes = require('./routes/poemRoutes'); // Import poem routes
const { errorHandler, notFound } = require('./middleware/errorMiddleware'); // Error handling
const app = express();

dotenv.config();

connectDB();

app.use(cors({
  origin: 'https://dead-poets-society.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/poems', poemRoutes); // Use poem routes

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const listEndpoints = require('express-list-endpoints');

console.log(listEndpoints(app));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

