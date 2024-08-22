const express = require("express");
const router = express.Router();

// POST
// Index
router.get("/", (req, res) => {
  res.send("get for posts");
});

// Show
router.get("/:id", (req, res) => {
  res.send("Get for post id");
});

// Post
router.post("/", (req, res) => {
  res.send("show for posts");
});

// Delete
router.delete("/:id", (req, res) => {
  res.send("delete for post id");
});

module.exports = router;