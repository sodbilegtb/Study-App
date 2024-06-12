const express = require("express");
const router = express.Router();
const deckController = require("../controllers/deckController");

router.get("/", deckController.index, deckController.indexView);
router.get("/create", deckController.getCardOptionsNew, deckController.createView);
router.post("/create", deckController.create, deckController.detailsView);
router.get("/:id", deckController.details, deckController.detailsView);
router.get("/:id/edit", deckController.getCardOptionsEdit, deckController.editView);
// TODO change to PUT
router.post("/:id/edit", deckController.edit, deckController.detailsView);
// TODO add DELETE

module.exports = router;