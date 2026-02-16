// // import dotenv from "dotenv";
// // import connectDB from "../src/db/dbConn.js";
// // import { app } from "../src/app.js";

// // dotenv.config();

// // connectDB();

// // export default app;




// import dotenv from "dotenv" ; 
// import connectDB from "./db/dbConn.js";
// import { app } from "./app.js";
// // import log from "cros/common/logger.js";

// dotenv.config({
//     path : './'
// })

// if (process.env.NODE_ENV == "production") {
//     connectDB().then(() => {
//         app.listen(process.env.PORT || 8000, () => {
//             console.log("Server running locally");
//         });
//     });
// }

// connectDB()
// .then(()=>{
//     app.listen(process.env.PORT || 8000,()=>{
//         console.log(`server is running on the ${process.env.PORT}`);
        
//     })
// })
// .catch((error)=>{
// console.log(error);

// })






// // /*

// // (async ()=>{
// //     try {
// //         mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
// //         app.on("error",(error)=>{
// //             console.log("ERROR : ", error);
// //             throw error
            
// //         })

// //         app.listen(process.env.PORT , ()=>{
// //             console.log(`app is listening on port ${process.env.PORT}`);
            
// //         })
        
// //     } catch (error) {
// //         console.error(error)
// //         throw err
// //     }
// // })()

// // */

import dotenv from "dotenv"
import connectDB from "./db/dbConn.js"
import { app } from "./app.js"

dotenv.config()

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error)
  })
