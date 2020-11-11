const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const app = express();

const configureOptions = {
  origin: ["http://localhost:3000", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
};

//Middleware configuration
app.use(cors(configureOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./"));

//MongoDB code below
mongoose.connect(
  "mongodb://localhost:27017/petraDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  function (err) {
    if (err) console.log("MongoDB Connection Error!");
    else console.log("Connected to PeTra MongoDB!");
  }
);

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  tokenId: {
    type: String,
  },
  googleId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  perks: {
    type: String,
  },
});

const hotelListSchema = new mongoose.Schema({
  img: String,
  location: String,
  title: String,
  description: String,
  star: Number,
  price: String,
  total: String,
  hotelID: Number,
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
});

const hotelSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  City: String,
  State: String,
  Country: String,
  CityLocation: {
    latitude: Number,
    longitude: Number,
  },
  hotelList: [hotelListSchema],
});

const hotelCollection = new mongoose.Schema({
  _id: String,
  hotelID: Number,
  images: [
    {
      url: String,
    },
  ],
  title: String,
  ratings: String,
  ratings_no: String,
  location: String,
  sub_title: String,
  guests: String,
  beds: [Boolean],
  bedrooms: [Boolean],
  bathrooms: [Boolean],
  description_short: String,
  the_space: String,
  guest_access: String,
  guest_access_points: [String],
  other: String,
  amenities: {
    lift: Boolean,
    ac: Boolean,
    wifi: Boolean,
    parking: Boolean,
    laptop: Boolean,
    disabled: Boolean,
    tv: Boolean,
    infant: Boolean,
  },
  amenities_basic: [String],
  amenities_facilities: [String],
  amenities_dining: [String],
  amenities_bb: [String],
  amenities_safety: [String],
  amenities_notincluded: [String],
  rating_cleanliness: String,
  rating_checkin: String,
  rating_communication: String,
  rating_accuracy: String,
  rating_Loaction: String,
  rating_value: String,
  reviews: [
    {
      name: String,
      dated: String,
      review: String,
    },
  ],
  sitter_name: String,
  sitter_description: String,
  sitter_mail: String,
  sitter_phone: String,
  sitter_care: String,
  sitter_value: String,
  sitter_knowledge: String,
  sitter_images: [
    {
      url: String,
    },
  ],
  sitter_available: [Boolean],
  spa_name: String,
  spa_images: [
    {
      url: String,
    },
  ],
  sap_services: [String],
  spa_mail: String,
  spa_phone: String,
  spa_care: String,
  spa_value: String,
  spa_quality: String,
  spa_available: [Boolean],
  map_description_short: String,
  map_description_getting_around: String,
  ppn: String,
  service_fee: String,
  taxes: String,
  spa_cost: String,
  sitter_cost: String,
  host_phone: String,
  host_mail: String,
  latitude: String,
  longitude: String,
  type: String,
});

const User = new mongoose.model("PetraUser", userSchema);

const Hotel = new mongoose.model("Hotel", hotelSchema);

const HotelCollection = new mongoose.model(
  "ALLhotelCollection",
  hotelCollection
);

//-----Uncomment the following lines of code to insert data into mongodb-----//

//This will add data into a collection called 'allhotelcollections'in petraDB

//Careful : Please change the file path after every insertion. If not done
//          same thing gets inserted into the database again

//Path to be changed after insertion : './Hotels/Bangalore/data/Hotel<new>.json'

// var newHotel1 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel6.json", "utf8")
// );
// var newHotelCollection = new HotelCollection(newHotel1);

// HotelCollection.insertMany([newHotelCollection], function (err, doc) {
//   if (err) console.log(err);
//   else console.log("Inserted Successfully!");
// });

//-----------------------------------Till here -----------------------------//

//-------Uncomment the following code to insert hotels based on cities------//

// var newHotel1 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel1.json", "utf8")
// );
// var newHotel2 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel2.json", "utf8")
// );
// var newHotel3 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel3.json", "utf8")
// );
// var newHotel4 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel4.json", "utf8")
// );
// var newHotel5 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel5.json", "utf8")
// );
// var newHotel6 = JSON.parse(
//   fs.readFileSync("./Hotels/Bangalore/data/Hotel6.json", "utf8")
// );

// // Note: Change the _id property on json given below for a new city
// // Bengaluru - INDKABLR
// // Chennai - INDTNCH
// // Mumbai - INDMHMU
// // Kolkata - INDWBKO
// // Delhi - INDHYDE
// // Hyderabad - INDTEHY

// newHotel = new Hotel({
//   _id: "INDKABLR",
//   City: "Bengaluru",
//   State: "Karnataka",
//   Country: "India",
//   CityLocation: {
//     latitude: 12.971599,
//     longitude: 77.594566,
//   },
//   hotelList: [
//     {
//       img: newHotel1.images[0].url,
//       location: newHotel1.location,
//       title: newHotel1.title,
//       description: newHotel1.sub_title,
//       star: Number(newHotel1.ratings),
//       price: "₹" + newHotel1.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel1.ppn) +
//             Number(newHotel1.taxes) +
//             Number(newHotel1.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel1.hotelID,
//       coordinates: {
//         latitude: Number(newHotel1.latitude),
//         longitude: Number(newHotel1.longitude),
//       },
//     },
//     {
//       img: newHotel2.images[0].url,
//       location: newHotel2.location,
//       title: newHotel2.title,
//       description: newHotel2.sub_title,
//       star: Number(newHotel2.ratings),
//       price: "₹" + newHotel2.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel2.ppn) +
//             Number(newHotel2.taxes) +
//             Number(newHotel2.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel2.hotelID,
//       coordinates: {
//         latitude: Number(newHotel2.latitude),
//         longitude: Number(newHotel2.longitude),
//       },
//     },
//     {
//       img: newHotel3.images[0].url,
//       location: newHotel3.location,
//       title: newHotel3.title,
//       description: newHotel3.sub_title,
//       star: Number(newHotel3.ratings),
//       price: "₹" + newHotel3.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel3.ppn) +
//             Number(newHotel3.taxes) +
//             Number(newHotel3.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel3.hotelID,
//       coordinates: {
//         latitude: Number(newHotel3.latitude),
//         longitude: Number(newHotel3.longitude),
//       },
//     },
//     {
//       img: newHotel4.images[0].url,
//       location: newHotel4.location,
//       title: newHotel4.title,
//       description: newHotel4.sub_title,
//       star: Number(newHotel4.ratings),
//       price: "₹" + newHotel4.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel4.ppn) +
//             Number(newHotel4.taxes) +
//             Number(newHotel4.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel4.hotelID,
//       coordinates: {
//         latitude: Number(newHotel4.latitude),
//         longitude: Number(newHotel4.longitude),
//       },
//     },
//     {
//       img: newHotel5.images[0].url,
//       location: newHotel5.location,
//       title: newHotel5.title,
//       description: newHotel5.sub_title,
//       star: Number(newHotel5.ratings),
//       price: "₹" + newHotel5.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel5.ppn) +
//             Number(newHotel5.taxes) +
//             Number(newHotel5.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel5.hotelID,
//       coordinates: {
//         latitude: Number(newHotel5.latitude),
//         longitude: Number(newHotel5.longitude),
//       },
//     },
//     {
//       img: newHotel6.images[0].url,
//       location: newHotel6.location,
//       title: newHotel6.title,
//       description: newHotel6.sub_title,
//       star: Number(newHotel6.ratings),
//       price: "₹" + newHotel6.ppn + "/night",
//       total:
//         "₹" +
//         String(
//           Number(newHotel6.ppn) +
//             Number(newHotel6.taxes) +
//             Number(newHotel6.service_fee)
//         ) +
//         "/night",
//       hotelID: newHotel6.hotelID,
//       coordinates: {
//         latitude: Number(newHotel6.latitude),
//         longitude: Number(newHotel6.longitude),
//       },
//     },
//   ],
// });

// Hotel.insertMany([newHotel], function (err, doc) {
//   if (err) {
//     console.log("Hotel did not get inserted!");
//     console.log(err);
//   } else console.log("Hotel got inserted into Hotel collection of PetraDB!");
// });

//-------------------------------Till Here-------------------------------------//

const client = new OAuth2Client(
  "1065157938718-eudu1eo9ic1l7dduroe3n85ffdthk9fp.apps.googleusercontent.com"
);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post("/auth/google/account/", function (req, res) {
  //Successfully Authenticated
  console.log(req.body);
  const { tokenId, googleId, imageUrl } = req.body;
  client
    .verifyIdToken({
      idToken: tokenId,
      audience:
        "1065157938718-eudu1eo9ic1l7dduroe3n85ffdthk9fp.apps.googleusercontent.com",
    })
    .then((response) => {
      const { email_verified, name, email } = response.payload;
      if (email_verified) {
        User.findOne({ email: email }, async function (err, user) {
          if (err) {
            return res.status(400).json({
              error: "Something Went Wrong!",
            });
          } else {
            if (user) {
              const token = jwt.sign(
                { _id: user._id },
                "This is a secret that we will keep it as a secret!",
                { expiresIn: "7d" }
              );
              const { _id, name, email, imageUrl, perks } = user;
              res.json({
                token,
                user: { _id, name, email, imageUrl, perks },
              });
            } else {
              newUser = new User({
                _id: googleId,
                tokenId: tokenId,
                googleId: googleId,
                name: name,
                email: email,
                imageUrl: imageUrl,
                perks: "1000",
              });
              User.insertMany([newUser], function (err, user) {
                if (err) console.log(err);
                else console.log("User has been registered!");
                if (user) {
                  const token = jwt.sign(
                    { _id: user._id },
                    "This is a secret that we will keep it as a secret!",
                    { expiresIn: "7d" }
                  );
                  const { _id, name, email, imageUrl, perks } = newUser;
                  res.json({
                    token,
                    user: { _id, name, email, imageUrl, perks },
                  });
                } else {
                  return res.status(400).json({
                    error: "Something Went Wrong!",
                  });
                }
              });
            }
          }
        });
      }
    });
});

app.post("/auth/google/account/search/", function (req, res) {
  console.log(req.body);
  Hotel.findOne({ _id: "INDKABLR" }, function (err, hotel) {
    if (err) {
      res.status(500).json({
        error: "There was an error retrieving data from database.",
      });
    } else {
      res.send({
        results: hotel.hotelList,
      });
    }
  });
});

app.post("/search/", function (req, res) {
  console.log(req.body);
  Hotel.findOne({ _id: "INDKABLR" }, function (err, hotel) {
    if (err) {
      res.status(500).json({
        error: "There was an error retrieving data from database.",
      });
    } else {
      res.send({
        results: hotel.hotelList,
      });
    }
  });
});

app.get("/auth/google/account/hotel/:hotelID", function (req, res) {
  const hotelid = Number(req.params.hotelID);
  HotelCollection.findOne({ hotelID: hotelid }, function (err, hotel) {
    if (err)
      res.status(500).json({
        error: "There was an error retrieving data for the hotel.",
      });
    else {
      res.send({
        results: hotel,
        LoggedIn: true,
      });
    }
  });
});

app.get("/hotel/:hotelID", function (req, res) {
  console.log(req.body);
  const hotelid = Number(req.params.hotelID);
  HotelCollection.findOne({ hotelID: hotelid }, function (err, hotel) {
    if (err)
      res.status(500).json({
        error: "There was an error retrieving data for the hotel.",
      });
    else {
      res.send({
        results: hotel,
        LoggedIn: false,
      });
    }
  });
});

app.listen(process.env.PORT || 3001, function () {
  console.log("Server Running on PORT 3001");
});
