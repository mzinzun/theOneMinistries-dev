const express = require('express');
const cors = require('cors');
// for authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
// require("dotenv").config();
const rateLimit = require('express-rate-limit');
// for routes
const routes = require('./routes/routes.js');
const User = require('./models/User.js');
require("./database/mongoose-connection.js");

// for environment variables
dotenv.config();
const app = express();
const PORT = process.env.API_PORT || 4040;
// Add this log to verify that the secret key is being loaded from your .env file
console.log('ACCESS_TOKEN_SECRET loaded:', process.env.ACCESS_TOKEN_SECRET ? '******' : 'NOT FOUND');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// CORS middleware configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);

// This is our authentication middleware. It will verify the JWT
// and attach the user's payload to the request object.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header Received:', authHeader);
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    console.error('Auth Error: No token provided.');
    return res.sendStatus(401); // Unauthorized - No token provided
  }

  console.log('Token being verified:', token);
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      // Add detailed error logging to see the exact reason for failure
      console.error('JWT Verification Error:', err.name, '-', err.message);
      return res.sendStatus(403); // Forbidden - Token is invalid
    }
    req.user = user; // Attach user payload to the request
    next(); // Proceed to the route handler
  });
};

let refreshTokens = [];
// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '8h' });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return refreshToken;
};
// user login endpoints located here for testing only
// will be moved to routes.js later
// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for username:', username);

  // const user = users.find(u => u.username === username);
  const user = await User.findOne({username: username});
  console.log('User found:', user ? user.firstName : 'No user found');

  if (!user) {
    console.log('Login failed: User not found');
    return res.status(404).send('User not found');
  }

  console.log('Comparing password...');
  const passwordIsValid = bcrypt.compareSync(password, user.password);
  console.log('Password valid:', passwordIsValid);

  if (!passwordIsValid) {
    console.log('Login failed: Invalid password');
    return res.status(401).send('Invalid password');
  }

  const accessToken = generateAccessToken({ id: user.id });
  const refreshToken = generateRefreshToken({ id: user.id });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
  });

  res.status(200).send({
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      history: user.history,
      morals: user.morals,
      studyStartDate: user.studyStartDate,
      journal: user.journal
    }
  });
});
// Token refresh route
app.post('/token', (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(403).send('Refresh token not found');
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid refresh token');
    }

    const accessToken = generateAccessToken({ id: user.id });
    res.status(200).send({ accessToken });
  });
});
// Logout route
app.post('/logout', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  refreshTokens = refreshTokens.filter(token => token !== refreshToken);
  res.clearCookie('refreshToken');
  res.status(200).send('Logged out');
});

// Protected route
app.get('/me', authenticateToken, async (req, res) => {
  // The user id is available from the token payload attached by the middleware
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password'); // Find user by ID, exclude password

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send back the user object in a consistent format
    res.status(200).json({
      id: user._id,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      history: user.history,
      morals: user.morals,
      studyStartDate: user.studyStartDate
    });
  } catch (error) {
    console.error('Error fetching user for /me route:', error);
    res.status(500).json({ success: false, message: 'Error fetching user data' });
  }
});

app.use((req, res, next) => {
  console.log(`incoming ${req.method} request for ${req.url}`);
  next()
})
routes(app, authenticateToken)

app.listen(PORT, () => console.log(`App listening on port ${PORT}`))
