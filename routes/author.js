const router = require('express').Router();
const authorController = require("../controller/authorController");

//ADD_AUTHOR
router.post("/", authorController.addAuthor);

//GET ALL AUTHORS
router.get("/", authorController.getAllAuthor);

//GET AN AUTHOR
router.get("/:id", authorController.getAnAuthor);

//UPDATE A AUTHOR
router.put("/:id", authorController.updateAuthor);

//DELETE AN AUTHOR
router.delete("/:id", authorController.deleteAuthor);



module.exports = router;