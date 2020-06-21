const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const authorize = require("../_helpers/authorize");

// routes
router.post("/authenticate", authenticate); // public route
router.post("/register", register); // public route
router.delete("/remove/:id", authorize(), deleteUser);
router.get("/", authorize(), getAll);
router.get("/:id", authorize(), getById); // all authenticated users
router.put("/update_profile", authorize(), updateProfile); // all authenticated users

module.exports = router;

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then(user =>
      user
        ? res.json(user)
        : res.status(400).json({
            message: "Incorrect username or password"
          })
    )
    .catch(err => next(err));
}

function register(req, res, next) {
  userService
    .register(req.body)
    .then(ok =>
      ok
        ? res.json({ message: "OK" })
        : res.status(400).json({
            message: "Incorrect username or password"
          })
    )
    .catch(err => next(err));
}

function deleteUser(req, res, next) {
  userService
    .removeUser(req.params.id)
    .then(deletedUser => res.status(200).json(deletedUser))
    .catch(err => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(err => next(err));
}

function getById(req, res, next) {
  const id = parseInt(req.params.id);

  userService
    .getById(id)
    .then(user => (user ? res.json(user) : res.sendStatus(404)))
    .catch(err => next(err));
}

function updateProfile(req, res, next) {
  const currentUser = req.user;
  const profile = req.body;

  if (Object.keys(profile).length < 3) {
    res.status(400).json({ message: "Not all fields are passed!" })
    return;
  }

  userService
    .updateProfile(currentUser.sub, profile)
    .then(() => res.status(200).json({ message: "OK" }))
    .catch(err => next(err));
}
