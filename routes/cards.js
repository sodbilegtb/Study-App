const express = require("express");
const cardController = require("../controllers/cardController");
const router = express.Router();

router.get("/", cardController.listCards);
router.get("/:id", cardController.showCardDetails);
router.get("/:id/edit", cardController.getCardEditForm);
router.post("/:id/edit", cardController.postCardEditForm);
router.post("/:id/delete", cardController.deleteCard);
router.get("/create", cardController.showCardCreateForm);
router.post("/create", cardController.createCard);

module.exports = router;