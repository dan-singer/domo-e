const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};


const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    res.status(400).json({ error: 'RAWR! All fields are required' });
    return;
  }

  Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      res.status(401).json({ error: 'Wrong username or password' });
      return;
    }

    req.session.account = Account.AccountModel.toAPI(account);

    res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    res.status(400).json({ error: 'RAWR! All fields are required' });
    return;
  }
  if (req.body.pass !== req.body.pass2) {
    res.status(400).json({ error: 'RAWR! Passwords do not match' });
    return;
  }

  Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      // console.log(err);

      if (err.code === 11000) {
        res.status(400).json({ error: 'Username already in use.' });
      }
    });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfJSON);
};

module.exports = {
  loginPage, login, logout, signup, getToken,
};
