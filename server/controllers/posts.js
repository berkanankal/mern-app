const Post = require("../models/Post");
const asyncHandler = require("express-async-handler");
const { uploadFile, getFileStream } = require("../s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const getAllPosts = asyncHandler(async (req, res) => {
  let query = Post.find().populate("creator", "name surname");
  let total = await Post.countDocuments();

  // Search
  if (req.query.search) {
    const regex = new RegExp(req.query.search, "i");

    query = query.where({ title: regex });

    total = await Post.countDocuments({ title: regex });
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pages = Math.ceil(total / limit);

  // const pagination = {};
  // if (startIndex > 0) {
  //   pagination.prev = {
  //     page: page - 1,
  //     limit,
  //   };
  // }
  // if (endIndex < total) {
  //   pagination.next = {
  //     page: page + 1,
  //     limit,
  //   };
  // }

  const posts = await query.skip(startIndex).limit(limit);

  return res.status(200).json({
    success: true,
    totalPosts: total,
    numberOfPages: pages,
    limit,
    data: posts,
  });
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "creator",
    "name surname"
  );

  return res.status(200).json({
    success: true,
    data: post,
  });
});

const createPost = asyncHandler(async (req, res) => {
  const information = req.body;

  // AWS S3
  if (req.file) {
    await uploadFile(req.file);
    await unlinkFile(req.file.path);
  }

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

const getPostImageByAws = asyncHandler(async (req, res) => {
  const fileKey = req.params.key;
  const fileStream = getFileStream(fileKey);

  fileStream.pipe(res);
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

  // AWS S3
  if (req.file) {
    await uploadFile(req.file);
    await unlinkFile(req.file.path);
  }

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
  getPostImageByAws,
  deletePost,
  updatePost,
  likePost,
  getPostById,
};
