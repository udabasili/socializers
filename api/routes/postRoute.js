const express = require('express')
const router = express.Router({mergeParams: true});
const { celebrate, Joi } = require("celebrate");
const { PostService } = require('../../services');
const io = require("../../loaders/socketIo")

router.post(
	"/posts/create-post",
	celebrate({
		body: {
		text: Joi.string().required(),
		},
	}),
	async function (req, res, next) {
		try {
		const posts = await PostService.addPost(req.body.text, req.params.userId);
		io.getIo().emit('posts', {
			action: 'updatedPosts',
			updatedPost: posts
		})
		return res.status(200).json({
			status: 200,
			message: {
			posts,
			},
		});
		} catch (error) {
		return next(error);
		}
	}
);

router.put(
	"/posts/:postId/edit",
	celebrate({
		body: {
		updatedPost: Joi.string().required(),
		},
	}),
	async function (req, res, next) {
		try {
		const posts = await PostService.updatePost(req.body.updatedPost, req.params.postId);
		io.getIo().emit('posts', {
			action: 'updatedPosts',
			updatedPost: posts
		})
		return res.status(200).json({
			status: 200,
			message: {
			posts,
			},
		});
		} catch (error) {
		return next(error);
		}
	}
);

router.delete(
	"/posts/:postId/delete",
	async function (req, res, next) {
		try {
		const posts = await PostService.deletePost(req.params.postId);
		io.getIo().emit('posts', {
			action: 'updatedPosts',
			updatedPost: posts
		})
		return res.status(200).json({
			status: 200,
			message: {
			posts,
			},
		});
		} catch (error) {
		return next(error);
		}
	}
);

router.get("/posts",async function (req, res, next) {
	try {
		 const posts = await PostService.getPosts()
		 return res.status(200).json({
		   status: 200,
		   message: {
			 posts,
		   },
		 });
	} catch (error) {
		return next(error)
	}
})

router.post("/posts/:postId/comment/add", async function (req, res, next) {
  try {
	const {
	  comments,
	  posts
	} = await PostService.addCommentToPost(req.body, req.params.postId)
	io.getIo().emit('posts', {
	  action: 'updatedPosts',
	  updatedPost: posts
	})
	io.getIo().emit('notification', {   
	  notification: {
		postId: req.params.postId,
		text: `${req.body.authorName} commented on a post `
	  },
	})
	return res.status(200).json({
	  status: 200,
	  message: {
		comments,
	  },
	});
  } catch (error) {
	return next(error)
  }
})


router.post("/posts/:postId/like", async function (req, res, next) {
  try {
	const {
	  likes,
	  posts
	} = await PostService.addLikeToPost(req.body.likedBy, req.params.postId)
	io.getIo().emit('posts', {
	  action: 'updatedPosts',
	  updatedPost: posts
	})
	io.getIo().emit('notification', {
	  postId: req.params.postId,
	  notification: `${req.body.likedBy} liked on a post `,
	})
	return res.status(200).json({
	  status: 200,
	  message: {
		likes,
	  },
	});
  } catch (error) {
	return next(error)
  }
})

module.exports = router