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

const allowedOrigins = [
  'https://dead-poets-society.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  },
  credentials: true, // Enable if you need cookies/authentication
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

