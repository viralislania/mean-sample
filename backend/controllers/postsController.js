const Post = require('../model/post');

exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        createdBy: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            post: {
                ...createdPost,
                id: createdPost._id
            }
        });
    });
}

exports.getPosts = (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: "Posts fetched successfully!",
            posts: documents
        });
    });
}

exports.getPostById = (req, res, next) => {
    Post.findById({ _id: req.params.id }).then(post => {
        if (post) {
            res.status(200).json({
                message: "Posts fetched successfully!",
                post: post
            });
        }
        else {
            res.status(404).json({
                message: "Posts not found!",
            });
        }

    });
}

exports.updatePost =  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, post).then(result => {
        if(result.n > 0) {
            res.status(200).json({ message: "Update successful!" });
        } else {
            res.status(401).json({ message: "Not Authorized" });
        }
    });
}

exports.deletePost = (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        if(result.n > 0) {
            res.status(200).json({ message: "Delete successful!" });
        } else {
            res.status(401).json({ message: "Not Authorized" });
        }
    });
}