const express = require("express");
const cardController = require("../controllers/cardController");
const methodOverride = require("method-override");
const router = express.Router();

router.use(methodOverride("_method", {
    methods: ["POST", "GET"]
}));

router.get("/", cardController.listCards, cardController.redirectView);
router.get("/create", cardController.showCardCreateForm);
router.post("/create", cardController.createCard);
router.get("/:id", cardController.showCardDetails);
router.get("/:id/edit", cardController.getCardEditForm);
router.post("/:id/edit", cardController.postCardEditForm);
router.delete("/:id/delete", cardController.deleteCard, cardController.redirectView);


module.exports = router;