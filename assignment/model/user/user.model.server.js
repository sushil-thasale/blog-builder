module.exports = function () {

  var model = null;
  var mongoose = require('mongoose');
  var UserSchema = require('./user.schema.server')();
  var UserModel = mongoose.model('UserModel', UserSchema);

  var api = {
    createUser: createUser,
    findUserById: findUserById,
    findUserByUsername: findUserByUsername,
    findUserByCredentials: findUserByCredentials,
    updateUser: updateUser,
    deleteUser:deleteUser,
    findUserByFacebookId: findUserByFacebookId,
    setModel: setModel
  };

  function createUser(user) {
    console.log("inside create user model");
    return UserModel.create(user);
  }

  function findUserById(userId){
    return UserModel.findById(userId);
  }

  function findUserByUsername(username){
    return UserModel.find({"username": username});
  }

  function findUserByCredentials(username, password){
    return UserModel.find({"username": username, "password": password});
  }

  function updateUser(userId, newUser){
    return UserModel.update({_id:userId},{$set:newUser});
  }

  function deleteUser(userId){
    return UserModel
      .findById(userId)
      .then(function(user) {
        var userWebsites = user.websites;
        return deleteUserAndWebsites(userWebsites, userId);
      }, function(err){
        return err;
      })
  }

  function deleteUserAndWebsites(userWebsites, userId){
    if(userWebsites.length == 0){
      return UserModel.remove({_id: userId})
        .then(function (response) {
          return response;
        }, function (err) {
          return err;
        });
    }

    return model.websiteModel.deleteWebsiteHelper(userWebsites.shift())
      .then(function(response) {
        return deleteUserAndWebsites(userWebsites, userId);
      }, function(err){
        return err;
      })
  }

  function findUserByFacebookId(facebookId) {
    return UserModel.findOne({'facebook.id': facebookId});
  }

  function setModel(_model) {
    model = _model;
  }

  return api;
};
