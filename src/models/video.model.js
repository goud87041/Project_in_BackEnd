import mongoose ,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model";

const videoSchema = new Schema({
    videoFile :{
        type : String , // coludnary URL
        required : true 
    },
    thumbnail : {
        type : String ,
        required : true
    },
     title : {
        type : String ,
        required : true
    },
     discription : {
        type : String ,
        required : true
    },
    duration : {
        type : Number , // coludnary URL 
        required : true
    },
    views : {
        type : Number ,
        // required : true ,
        default : 0
    },
    owner : {
        type : mongoose.Types.ObjectId(),
        ref : User
    },
    isPublish :{
        type : Boolean,
        default : true
    }


},{timestamps : true})

videoSchema.plugin(mongooseAggregatePaginate)


export const Video = mongoose.model("Video", videoSchema)