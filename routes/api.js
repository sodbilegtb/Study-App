const router = require("express").Router();
const deckController = require("../controllers/deckController");


router.get("/decks", deckController.index, deckController.respondJSON);
router.get("/decks/:id", deckController.details, deckController.respondJSON);
//router.get("/decks/:id/study", deckController.updateStudied);
router.use(deckController.errorJSON);

module.exports = router;