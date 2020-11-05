const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const { OAuth2Client } = require("google-auth-library");
const { response } = require("express");
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
  "mongodb://localhost:27017/userDB",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  function (err) {
    if (err) console.log("MongoDB Connection Error!");
    else console.log("Connected to MongoDB!");
  }
);
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  tokenId: String,
  googleId: String,
  name: String,
  email: String,
  imageUrl: String,
  isVerified: Boolean,
  perks: Number,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);
const client = new OAuth2Client(
  "1065157938718-eudu1eo9ic1l7dduroe3n85ffdthk9fp.apps.googleusercontent.com"
);

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post("/auth/google/account/", function (req, res) {
  //Successfully Authenticated
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
        User.findOne({ email }).exec((err, user) => {
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
              let newUser = new User({
                tokenId: tokenId,
                googleId: googleId,
                name: name,
                email: email,
                imageUrl: imageUrl,
                isVerified: true,
                perks: 1000,
              });
              newUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: "Something Went Wrong!",
                  });
                } else {
                  const token = jwt.sign(
                    { _id: data._id },
                    "This is a secret that we will keep it as a secret!",
                    { expiresIn: "7d" }
                  );
                  const { _id, name, email, imageUrl, perks } = newUser;
                  res.json({
                    token,
                    user: { _id, name, email, imageUrl, perks },
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
  res.send({
    NumberOfResults: 10,
    Source: "Data obtained from MONGODB",
    results: [
      {
        img:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
        location: "Bangalore Central",
        title: "Stay at this spacious Edwardian House",
        description:
          "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
        star: 4.73,
        price: "£30 / night",
        total: "£117 total",
        hotelID: 1,
        coordinates: [12.971599, 77.594566],
      },
      {
        img:
          "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
        location: "Kattriguppe",
        title: "Independant luxury studio apartment",
        description:
          "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
        star: 4.3,
        price: "£40 / night",
        total: "£157 total",
        hotelID: 2,
        coordinates: [12.933435, 77.557832],
      },
      {
        img:
          "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
        location: "Jayanagar 4th Block",
        title: "London Studio Apartments",
        description:
          "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
        star: 3.8,
        price: "£35 / night",
        total: "£207 total",
        hotelID: 3,
        coordinates: [12.92594, 77.583038],
      },
      {
        img:
          "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
        location: "PES University",
        title: "Independant luxury studio apartment",
        description:
          "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
        star: 4.3,
        price: "£40 / night",
        total: "£157 total",
        hotelID: 4,
        coordinates: [12.935641, 77.535857],
      },
      {
        img:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
        location: "UB City",
        title: "Stay at this spacious Edwardian House",
        description:
          "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
        star: 4.73,
        price: "£30 / night",
        total: "£117 total",
        hotelID: 5,
        coordinates: [12.9716418, 77.5955194],
      },
      {
        img:
          "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
        location: "Brigade Millenium",
        title: "London Studio Apartments",
        description:
          "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
        star: 3.8,
        price: "£35 / night",
        total: "£207 total",
        hotelID: 6,
        coordinates: [12.8906899, 77.5804962],
      },
    ],
  });
});

app.post("/search/", function (req, res) {
  console.log(req.body);
  res.send({
    NumberOfResults: 10,
    Source: "Data obtained from MONGODB",
    results: [
      {
        img:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
        location: "Bangalore Central",
        title: "Stay at this spacious Edwardian House",
        description:
          "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
        star: 4.73,
        price: "£30 / night",
        total: "£117 total",
        hotelID: 1,
        coordinates: [12.971599, 77.594566],
      },
      {
        img:
          "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
        location: "Kattriguppe",
        title: "Independant luxury studio apartment",
        description:
          "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
        star: 4.3,
        price: "£40 / night",
        total: "£157 total",
        hotelID: 2,
        coordinates: [12.933435, 77.557832],
      },
      {
        img:
          "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
        location: "Jayanagar 4th Block",
        title: "London Studio Apartments",
        description:
          "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
        star: 3.8,
        price: "£35 / night",
        total: "£207 total",
        hotelID: 3,
        coordinates: [12.92594, 77.583038],
      },
      {
        img:
          "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
        location: "PES University",
        title: "Independant luxury studio apartment",
        description:
          "2 guest · 3 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen",
        star: 4.3,
        price: "£40 / night",
        total: "£157 total",
        hotelID: 4,
        coordinates: [12.935641, 77.535857],
      },
      {
        img:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
        location: "UB City",
        title: "Stay at this spacious Edwardian House",
        description:
          "1 guest · 1 bedroom · 1 bed · 1.5 shared bthrooms · Wifi · Kitchen · Free parking · Washing Machine",
        star: 4.73,
        price: "£30 / night",
        total: "£117 total",
        hotelID: 5,
        coordinates: [12.9716418, 77.5955194],
      },
      {
        img:
          "https://www.smartertravel.com/uploads/2017/07/Untitled-design-8.jpg",
        location: "Brigade Millenium",
        title: "London Studio Apartments",
        description:
          "4 guest · 4 bedroom · 4 bed · 2 bathrooms · Free parking · Washing Machine",
        star: 3.8,
        price: "£35 / night",
        total: "£207 total",
        hotelID: 6,
        coordinates: [12.8906899, 77.5804962],
      },
    ],
  });
});

app.listen(process.env.PORT || 3001, function () {
  console.log("Server Running on PORT 3001");
});
