const userModel = require('../models/userModels')
const cloudinary = require('../config/cloudinary')
const fs = require('fs')

exports.signUp =  async (req,res)=>{
    const files = req.files
    const {firstName, lastName,email} = req.body
  try {
    // check if the user exists
    const checkUser = await userModel.findOne({email:email.toLowerCase()})
    if (checkUser) {
      if(files?.profilePicture){
        fs.unlinkSync(files.profilePicture[0].path)
      }
      if (files?.gallery) {
        files.gallery.forEach((el)=> fs.unlinkSync(el.path))
      }
      return res.status(400).json({
        message:'user already exists'
      })
    }
    
    // upload profile  image  to cloudinary
    let profilePicture = null
    if (files?.profilePicture) {
      const profileimg =  files.profilePicture[0]
      const profileimgResoure  =  await cloudinary.uploader.upload(profileimg.path)
      profilePicture = {
        url:profileimgResoure.secure_url,
        publicId:profileimgResoure.public_id
      }
      fs.unlinkSync(profileimg.path)
    }
   
    // upload gallery(multiple  pictures) to cloudinary
    const galleryImageResource =[]
    // iterote through file 
    if (files?.gallery) {
      for(const images of files.gallery){
        const cloudinaryImages =  await cloudinary.uploader.upload(images.path)
        const galleryImages={
          url : cloudinaryImages.secure_url,
          publicId:cloudinaryImages.public_id,
        }
        // push the gallery image into the array
        galleryImageResource.push(galleryImages)
      }
    }
    const data ={
      firstName,
      lastName,
      email: email?.toLowerCase(),
      displayPicture:profilePicture,
      gallery:galleryImageResource
    }

    // create new user
    const newUser = new userModel(data)
    const savedUser = await newUser.save()

    return res.status(201).json({
      message:'sign up successfully',
      data: savedUser,

    })
  } catch (error) {
    // if there is an error delete images
    if (req.files?.profilePicture) {
      fs.unlinkSync(req.files?.profilePicture[0].path)
    }
    if (req.files?.profilePicture) {
      fs.unlinkSync(req.files?.profilePicture[0].path)
    }
    if (req.files?.gallery) {
      req.files?.gallery.forEach((el)=>fs.unlinkSync(el.path))
    }
   res.status(500).json({
       message:'Error signing up',
       error:error.message
    })
  }
}
exports.updateUser = async (req,res)=>{
    const {id} = req.params
    const {firstName,lastName,email} = req.body
    const files = req.files
  try {
    const user = await userModel.findById(id)
    // check if user exists
    if (!user) {
      if(files?.profilePicture){
        // delete profilepicture locally
        fs.unlinkSync(files?.profilePicture)
      }
      return res.status(404).json({
        message:'user not found'
      })

    }
    let profilePic =  files.profilePicture[0].path
    let profilePicUpload  = await cloudinary.uploader.upload(profilePic)

    const profileimg = {
      url : profilePicUpload.secure_url,
      publicId:  profilePicUpload.public_id,
    }
    fs.unlinkSync(profilePic)

    // delete old gallery images  from cloudinary
    if (files?.gallery) {
      if (user?.gallery && user?.gallery.length > 0 ) {
        for (const img of user.gallery){
          await cloudinary.uploader.destroy(img.publicId)
        }
      }
    }
    // upload  gallery  images to cloudinary 
    const newGalleryImages = []
    for(const image of files?.gallery){
      const cloudUpload =  await  cloudinary.uploader.upload(image.path)
      const  newImage = {
        url:cloudUpload.secure_url,
        publicId: cloudUpload.public_id,
      }
      newGalleryImages.push(newImage)
      fs.unlinkSync(image.path)
    }

    const data = {firstName,lastName,email,displayPicture: profileimg, gallery:newGalleryImages}
    //  update user
    const updateUser =  await userModel.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).json({
      message:'user updated successfully',
      data:updateUser
    })

  } catch (error) {
    //  when  there is  on error delete file locally
    if (req?.files.profilePicture) {
      fs.unlinkSync(req?.files.profilePicture[0].path)
    }
    if (req?.files.gallery) {
      req.files.gallery.forEach((el)=> fs.unlinkSync(el.path))
    }

    return res.status(500).json({
      message:'Error updating user',
      error:error.message
    })
  }
}
exports.getAll = async(req,res)=>{

  try {
    const user = await userModel.find()
    res.status (200).json({
      message:'get  all user successfully',
      data:user
    })
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}
exports.getOneUser  =  async (req ,res)=>{
    const{id}=req.params
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return res.status(404).json({
        message:'user not found'
      })
    }
    res.status(200).json({
      message:'get one user successfully',
      data: user
    })
    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

exports.deleteUser = async (req,res)=>{
  const {id} = req.params
  
  try {
    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
      return res.status(404).json({
        message:'user not found'
      })
    
    }
    await cloudinary.uploader.destroy(user.profilePicture.publicId)

    res.status(200).json({
      message:'deleting one user successfully',
      data:user
    })
    
    
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}