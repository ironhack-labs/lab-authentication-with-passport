
const { Schema, model } =require('mongoose')

const userSchema = new Schema({
  
    username:{
        type:String,
        require:true
    },
    password: {
        type: String,
        required: true
    },
    
},
{
    timestamps:true,
  }
)

module.exports=model('User', userSchema);