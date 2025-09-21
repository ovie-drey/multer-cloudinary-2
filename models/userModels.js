const mongoose  =  require ('mongoose')

const userSchema =  new mongoose.Schema({
  firstName:{
    type:String,
    required:true
  },
  lastName:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  displayPicture:{
    url:{
      type:String,
      required:true
    },
    publicId:{
      type:String,
      required:true
    }
  },
  gallery:[
    {
      url:{
        type:String,
        required:true
      },
      publicId:{
        type:String,
        required:true
      }

  }
  
]
}, {timestamps})

const  userModel  =  mongoose.model('user',userSchema)

module.exports  =  userModel