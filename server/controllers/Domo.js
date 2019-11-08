const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      res.status(400).json({ error: 'An error occured' });
      return;
    }
    res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};
const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.squirrelsOwned) {
    res.status(400).json({ error: 'RAWR! Both name and age are required' });
    return;
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    squirrelsOwned: req.body.squirrelsOwned,
    owner: req.session.account._id,
  };
  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Domo already exists.' });
      return;
    }
    res.status(400).json({ error: 'An error occured' });
    return;
  });
  return;
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  Domo.DomoModel.deleteByName(req.session.account._id, req.body.name)
  .then(() => {
    res.json({ status: 'OK' });
  })
  .catch(() => {
    res.status(400).json({ error: 'An error occured' });
  });
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      // console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.json({ domos: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
