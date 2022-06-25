const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find().populate("creator", "name surname");

  return res.status(200).json({
    success: true,
    data: posts,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const information = req.body;

  if (req.savedImage) {
    information.postImage = req.savedImage;
  }

  information.creator = req.user._id;

  let post = await Post.create(information);

  post = await post.populate("creator", "name surname");

  return res.status(201).json({
    success: true,
    data: post,
  });
});

const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Post.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const information = req.body;

  if (req.savedImage) {
    information.postImage = req.savedImage;
  }

  const post = await Post.findByIdAndUpdate(id, information, {
    new: true,
    runValidators: true,
  }).populate("creator", "name surname");

  return res.status(200).json({
    success: true,
    data: post,
  });
});

const likePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId).populate("creator", "name surname");

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((like) => like != userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();

  return res.status(200).json({
    success: true,
    data: post,
  });
});

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
};
