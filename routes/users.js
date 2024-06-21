const express = require("express");
const usersController = require("../controllers/userController");
const router = express.Router();
const methodOverride = require("method-override");

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.get("/login", usersController.loginView);
router.post("/login", usersController.authenticate, usersController.redirectView);
router.get("/logout", usersController.logout, usersController.redirectView);
router.get("/", usersController.index, usersController.indexView);
router.get("/new", usersController.createView);
router.post("/create", usersController.create, usersController.redirectView);
router.get("/:id/edit", usersController.editView);
router.get("/:id/edit/password", usersController.editPasswordView);
router.post("/:id/edit/password", usersController.editPassword, usersController.redirectView);
router.put("/:id/update", usersController.edit, usersController.redirectView);
router.delete("/:id/delete", usersController.delete, usersController.redirectView);
router.get("/:id", usersController.profileView);

module.exports = router;