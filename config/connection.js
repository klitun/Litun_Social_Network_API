const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/socialNetworkAPI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection;
