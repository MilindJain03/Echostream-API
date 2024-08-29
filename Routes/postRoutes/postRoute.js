const { Router } = require("express");
const postController = require("../../Controller/postController/postController");
const upload = require("../../multer.middleware");

const router = Router();

router.post("/" , upload.array('file',5), postController.createPost);
router.post("/feeds", postController.getPostWithMedia);
router.post("/updateBookmark", postController.updateBookmark);
router.post("/updateLikes", postController.updateLikes);
router.get("/media", postController.getMedia);
router.get("/getBookmark", postController.getBookmarks);

module.exports = router; 