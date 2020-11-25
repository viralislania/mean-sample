const router = require('express').Router();
const checkAuth = require('../middleware/check-auth');
const postController = require('../controllers/postsController');
const fileExtract = require('../middleware/file');


router.post("",
    checkAuth,
    fileExtract, postController.createPost);

router.get("", postController.getPosts);

router.get("/:id", postController.getPostById);

router.delete("/:id", checkAuth, postController.deletePost);

router.put(
    "/:id",
    checkAuth,
    fileExtract,
    postController.updatePost
);

module.exports = router;