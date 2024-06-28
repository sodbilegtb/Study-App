const router = require("express").Router();
const deckController = require("../controllers/deckController");
const cardController = require("../controllers/cardController");

router.get("/decks", deckController.index, deckController.respondJSON);
router.get("/decks/:id", deckController.details, deckController.respondJSON);
//router.get("/decks/:id/study", deckController.updateStudied);
router.use(deckController.errorJSON);

router.get("/cards", cardController.listCards, cardController.respondJSON);
router.get("/cards/:id", cardController.showCardDetails, cardController.respondJSON);
router.use(cardController.errorJSON);

module.exports = router;