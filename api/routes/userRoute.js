const express = require("express");
const multer = require("multer");
const services = require('../../services');
const { celebrate, Joi } = require('celebrate');
const router = express.Router({mergeParams: true});
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { User } = require("../../models");
const cloudinary = require ('cloudinary').v2;
const config = require('../../config');
const fetch = require("node-fetch");

let no = 0
const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
	folder: "snagged",
	format: async (req, file) => {
	  return "jpeg";
	},
	public_id: async (req, file, cb) => {
		no++;
		return `${req.params.userId}__${no}`
	},
  }
});

const upload = multer({
	storage: storage,
})

var cpUpload = upload.array( 'file', 8)

router.get("/users",
  async (req, res, next) => {
	try {
		const users = await services.UserService.getUsers();
		return res.status(200).json({
			status: 200,
			message: users
	  	})
	} catch (err) {
	  	next(err)
	}
  }
)
router.post("/get-current-location",
	celebrate({
		body: Joi.object({
		lat: Joi.number().required(),
		long : Joi.number().required()
		})
	}),
	async (req, res, next) =>{  
		try{
			const location = await services.UserService.getUserLocation(req.body);
			if(location){
				return  res.status(200).json({
				status:200,
				message: location
		})
	  }
	} catch(err){next(err)}
  }
  )

router.post("/image-upload/add", cpUpload, async function(req, res, next){
  try {
	const user = await services.UserService.imageUploads(req.files, req.params.userId)
	return res.status(200).json({
		message:{
			user
		}
	})
  } catch (error) {
	  return(next(error))
  }
})

router.post("/user-info/add", async (req, res, next) => {
  try {
		const user = await services.UserService.addUserInfo(req.params.userId, req.body)
		return res.status(200).json({
			status: 200,
			message:{
				user
			}
			})       
	} catch (error) {     
		return next({
		status:400,
		message: error.message
		})
   }
})

router.get("/add-friend/:addedFriend",
  async (req, res, next) => {
	try {
		let user = await User.findOne({_id: req.params.userId})
		const addedFriend = await User.findById(req.params.addedFriend)
		const filteredAddedFriend = await User.findById(req.params.addedFriend).select({
			userImages: 1,
			username: 1
	})
	const filteredCurrentUser = await User.findOne({_id: req.params.userId}).select({
		userImages: 1,
		username: 1
	})
	user = await user.addFriend(filteredAddedFriend)
	await addedFriend.addFriend(filteredCurrentUser)
	return res.status(200).json({
		status: 200,
		message: {
		  user
		}
	  })
	} catch (err) {
	  next(err)
	}
  }
)

router.put("/user-info/edit", async (req, res, next) => {
	try {
		const user = await services.UserService.editUserInfo(req.params.userId, req.body)
		return res.status(200).json({
		status: 200,
		message: {
			user
		}
		})
	} catch (error) {
		return next({
		status: 400,
		message: error.message
		})
  	}
})

router.post("/user-interests/add", async (req, res, next) => {
  try {
	const user = await services.UserService.addUserInterest(req.params.userId, req.body)
	return res.status(200).json({
		status: 200,
		message:{
			user
		  }
		})       
  } catch (error) {     
	return next({
	  status:400,
	  message: error.message
	 })
   }
})

router.get("/world-news",(req, res, next)=>{
  const url = 'http://newsapi.org/v2/top-headlines?' +
	'country=us&' +
	`apiKey=${config.newsApi}`;
  fetch(url)
	.then(function (response) {
	  return response.json()
	
	})
	.then((response) => {
	return res.status(200).json({
	  status: 200,
	  message: response,
	});
	})
	.catch((error) =>{
	  return next({
		status: 400,
		message: error.message
	  })
	})
})

module.exports = router