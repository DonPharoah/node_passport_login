import express = require('express');
const authRoutes = express.Router();
import * as jwt from 'jsonwebtoken';

authRoutes.post('/login', (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader) {
    const error = new Error('Not authorized.');
    // @ts-ignore
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodedToken) {
    const error = new Error('Not authenticated');
    // @ts-ignore
    error.statusCode = 401;
    throw error;
  }
  // if past this point, we know the user IS valid and authenticated.
  res.status(200).json({ message: 'Successfully logged in! ' });
});

authRoutes.post('/create-user', (req, res, next) => {
  const username = req.body.username;

  const token = jwt.sign({ username: username, userId: 'asdfasdfasdf' }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
  res.status(200).json({
    message: 'Successfully created user',
    token: token,
    username: username,
  });
  req.app.locals.username = username;
});

export default authRoutes;
