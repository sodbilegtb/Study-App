const express = require("express");
const router = express.Router();
const deckController = require("../controllers/deckController");
const methodOverride = require("method-override");

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.get("/", deckController.index, deckController.redirectView, deckController.indexView);
router.get("/create", deckController.getCardOptionsNew, deckController.createView);
router.post("/create", deckController.create, deckController.redirectView, deckController.detailsView);
router.get("/:id", deckController.details, deckController.redirectView, deckController.detailsView);
router.get("/:id/edit", deckController.getCardOptionsEdit, deckController.editView);
router.get("/:id/study", deckController.updateStudied, deckController.redirectView);
router.put("/:id/update", deckController.edit, deckController.detailsView);
router.delete("/:id/delete", deckController.delete, deckController.redirectView);

module.exports = router;