const config = require("config.json");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

module.exports = {
  authenticate,
  getAll,
  getById,
  register,
  removeUser,
  updateProfile
};

async function authenticate({ username, password }) {
  const user = await User.findOne({
    username
  }).lean();

  let userPass = password;

  if (user) {
    const correctPass = bcrypt.compareSync(userPass, user.password);

    if (!correctPass) {
      throw "Password is incorrect!";
    }

    const token = jwt.sign(
      {
        sub: user._id,
        role: user.role
      },
      config.secret
    );

    const { password, __v, ...userWithoutPassword } = user;

    return {
      ...userWithoutPassword,
      token
    };
  }
}

async function register({
  username,
  password,
  email
}) {
  const existing = await User.findOne({ username }).lean();

  if (existing) {
    throw "User already exists!";
  }

  let userBase = {
    _id: new mongoose.Types.ObjectId(),
    username,
    password: bcrypt.hashSync(password, 10)
  };

  if (email) {
    userBase.email = email;
  }

  let newUser = new User(userBase);

  newUser.save().catch(err => console.log(err));

  return true;
}

async function removeUser(userId) {
  let deletedUser = await User.findByIdAndDelete(userId);
  let result = {
    message: "There's no user with such ID!"
  };

  if (deletedUser) {
    const { __v, password, ...safeUser } = deletedUser;
    result = safeUser;
  }

  return result;
}

async function getAll() {
  let users = await User.find().lean();

  return users.map(u => {
    const { password, __v, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
}

async function getById(id) {
  const user = await User.findOne({ _id: id }).lean();

  if (!user) {
    throw `There is no user with id: ${id}`;
  }

  const { password, __v, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

async function updateProfile(userId, updatedProfile) {
  await User.findByIdAndUpdate(userId, {
    $set: {
      username: updatedProfile.username,
      firstname: updatedProfile.firstname,
      lastname: updatedProfile.lastname
    }
  }) 
}
