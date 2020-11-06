const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const app = express();

const configureOptions = {
  origin: ["http://localhost:3000", "http://localhost:3000"],
  methods: "GET,POST,PUT,DELETE",
};

//Middleware configuration
app.use(cors(configureOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  photos: [
    {
      img: String,
    },
  ],
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

const User = new mongoose.model("PetraUser", userSchema);

const Hotel = new mongoose.model("Hotel", hotelSchema);

// newHotel = new Hotel({
//   _id: "INDKABLR",
//   City: "Bangalore",
//   State: "Karnataka",
//   Country: "India",
//   CityLocation: {
//     latitude: 12.971599,
//     longitude: 77.594566,
//   },
//   hotelList: [
//     {
//       img:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//       location: "Bangalore Central",
//       title: "Stay at this spacious Edwardian House",
//       description:
//         "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
//       star: 4.73,
//       price: "£30 / night",
//       total: "£117 total",
//       hotelID: 1,
//       coordinates: {
//         latitude: 12.971599,
//         longitude: 77.594566,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//     {
//       img:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//       location: "Kattriguppe",
//       title: "Independant luxury studio apartment",
//       description:
//         "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
//       star: 4.3,
//       price: "£40 / night",
//       total: "£157 total",
//       hotelID: 2,
//       coordinates: {
//         latitude: 12.933435,
//         longitude: 77.557832,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//     {
//       img:
//         "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
//       location: "Jayanagar 4th Block",
//       title: "London Studio Apartments",
//       description:
//         "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
//       star: 3.8,
//       price: "£35 / night",
//       total: "£207 total",
//       hotelID: 3,
//       coordinates: {
//         latitude: 12.92594,
//         longitude: 77.583038,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//     {
//       img:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//       location: "PES University",
//       title: "Independant luxury studio apartment",
//       description:
//         "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
//       star: 4.3,
//       price: "£40 / night",
//       total: "£157 total",
//       hotelID: 4,
//       coordinates: {
//         latitude: 12.935641,
//         longitude: 77.535857,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//     {
//       img:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//       location: "UB City",
//       title: "Stay at this spacious Edwardian House",
//       description:
//         "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
//       star: 4.73,
//       price: "£30 / night",
//       total: "£117 total",
//       hotelID: 5,
//       coordinates: {
//         latitude: 12.9716418,
//         longitude: 77.5955194,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//     {
//       img:
//         "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
//       location: "Brigade Millenium",
//       title: "London Studio Apartments",
//       description:
//         "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
//       star: 3.8,
//       price: "£35 / night",
//       total: "£207 total",
//       hotelID: 6,
//       coordinates: {
//         latitude: 12.8906899,
//         longitude: 77.5804962,
//       },
//       photos: [
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//         {
//           img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//         },
//       ],
//     },
//   ],
// });

// Hotel.insertMany([newHotel], function (err, doc) {
//   if (err) console.log("Hotel did not get inserted!");
//   else console.log("Hotel got inserted into Hotel collection of PetraDB!");
// });

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

app.listen(process.env.PORT || 3001, function () {
  console.log("Server Running on PORT 3001");
});
