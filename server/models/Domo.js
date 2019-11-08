const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  age: {
    type: Number,
    min: 0,
    required: true,
  },
  squirrelsOwned: {
    type: Number,
    min: 0,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  squirrelsOwned: doc.squirrelsOwned,
});

DomoSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertId(ownerID),
  };
  return DomoModel.find(search).select('name age squirrelsOwned').exec(callback);
};

DomoSchema.statics.deleteByName = (ownerID, name) => {
  const search = {
    owner: convertId(ownerID),
    name,
  };
  return DomoModel.deleteOne(search);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;
