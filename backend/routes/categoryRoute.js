const express = require("express");
const router = express.Router();
const categories = require("../controllers/categoryController");

router.get("/show", categories.getCategories);
router.post("/add", categories.addCategory);
router.delete("/delete/:id", categories.deleteCategory);

module.exports = router;
