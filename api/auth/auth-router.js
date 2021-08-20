const router = require('express').Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../../config/secrets');

const Jokes = require('../jokes/jokes-data.js')
//const authRouter = require('../auth/auth-model')

const checkAuthPayload = require('./check-payload-middleware');

function buildToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '1d',
  }
  return jwt.sign(payload, TOKEN_SECRET, options)
}


  router.post('/register', checkAuthPayload, (req, res, next) => {
    let user = req.body;
    const rounds = process.env.BCRYPT_ROUNDS || 8; 
    const hash = bcrypt.hashSync(user.password, rounds);
    user.password = hash
  
    Jokes.add(user)
      .then(saved => {
        res.status(201).json({ message: `Great to have you, ${saved.username}` });
      })
      .catch(next); 
  });
  
  router.post('/login', checkAuthPayload, (req, res, next) => {
    let { username, password } = req.body;
  
    Jokes.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = buildToken(user)
          res.status(200).json({
            message: `Welcome back ${user.username}!`,
            token: token,
          });
        } else {
          next({ status: 401, message: 'invalid credentials' });
        }
      })
      .catch(next);
  });
  
  

module.exports = router;
