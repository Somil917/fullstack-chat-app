const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/auth.middleware");
const messageController = require("../controllers/message.controller");

router.get(
  "/getUsers",
  middleware.authUser,
  messageController.getUsersForSidebar
);

router.get("/:id", middleware.authUser, messageController.getMessages);

router.post("/send/:id", middleware.authUser, messageController.sendMessage)

module.exports = router;
