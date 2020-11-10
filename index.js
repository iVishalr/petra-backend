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
  beds: [Boolean, Boolean],
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
  map_description_short: String,
  map_description_getting_around: String,
  ppn: String,
  service_fee: String,
  taxes: String,
  spa_cost: String,
  sitter_cost: String,
  host_phone: String,
  host_mail: String,
});

const User = new mongoose.model("PetraUser", userSchema);

const Hotel = new mongoose.model("Hotel", hotelSchema);

const HotelCollection = new mongoose.model(
  "ALLhotelCollection",
  hotelCollection
);

// newHotelCollection = new HotelCollection({
//   hotelID: 2,
//   images: [
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//   ],
//   title: "JW Marriot",
//   ratings: "4.5",
//   ratings_no: "8",
//   location: "Bangalore, Karnataka, India",
//   sub_title: "Sub-Title",
//   guests: "no of Guests per room",
//   beds: [true, false],
//   bedrooms: [true],
//   bathrooms: [true],
//   description_short: "short description",
//   the_space: "about space",
//   guest_access: "details",
//   guest_access_points: ["1", "2", "3"],
//   other: "other things to note",
//   amenities: {
//     lift: true,
//     ac: false,
//     wifi: true,
//     parking: true,
//     laptop: true,
//     disabled: true,
//     tv: false,
//     infant: false,
//   },
//   amenities_basic: ["Wifi", "TV", "AC", "Laptop"],
//   amenities_facilities: ["Hot water", "Lift", "Free Parking"],
//   amenities_dining: ["Microwave", "Refrigerator"],
//   amenities_bb: ["Hair dryer", "Hanger", "Shampoo", "Bed linen"],
//   amenities_safety: ["Fire Extinguisher"],
//   amenities_notincluded: ["Smoke Alarms"],
//   rating_cleanliness: "4.5",
//   rating_communication: "4.5",
//   rating_checkin: "4.0",
//   rating_accuracy: "4.2",
//   rating_Loaction: "3.9",
//   rating_value: "5",
//   reviews: [
//     {
//       name: "name 1",
//       dated: "october 2020",
//       review: "hello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 2",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywhere.hello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 3",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 4",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywherehello iam here. I am there .iam everywherehello iam here. I am there .iam everywherehello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 5",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 6",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 7",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//     {
//       name: "name 8",
//       dated: "october 2020",
//       review:
//         "hello iam here. I am there .iam everywherehello iam here. I am there .iam everywhere",
//     },
//   ],
//   sitter_name: "name",
//   sitter_description: "description of sitter",
//   sitter_mail: "helllo@gmail.com",
//   sitter_phone: "1234567890",
//   sitter_care: "4.5",
//   sitter_value: "4",
//   sitter_knowledge: "4.3",
//   sitter_images: [
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//   ],
//   spa_name: "name",
//   spa_images: [
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//     {
//       url:
//         "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ_wbPYTxQPMcBh7SPzLFActXnP3uhifeVT_g&usqp=CAU",
//     },
//     {
//       url:
//         "https://www.expatkings.com/wp-content/uploads/2018/10/Airbnb-rental-tips.-Hostmaker-1-620x349.jpg",
//     },
//   ],
//   sap_services: [
//     "description of spa",
//     "description of spa",
//     "description of spa",
//   ],
//   spa_mail: "helllo@gmail.com",
//   spa_phone: "1234567890",
//   spa_care: "4.5",
//   spa_value: "4",
//   spa_quality: "4.3",
//   map_description_short: "short description",
//   map_description_getting_around:
//     "Its a 2 minute walk to the Metro Station. Half a minute walk to the Main Road, where auto-rickshaws will be in abundance. OLA/Uber and other cabs services available 24/7. Within a 2 Kms radius, there are multiple bus stops. If you need to park your 2 or 4 wheeler, we provide ample parking space in our basement. Hosmat Hospital is a 5 minute walk from the guest house.",
//   ppn: "2000",
//   service_fee: "353",
//   taxes: "243",
//   spa_cost: "200",
//   sitter_cost: "50",
//   host_phone: "8964287513",
//   host_mail: "peTra@pes.edu",
// });

// HotelCollection.insertMany([newHotelCollection], function (err, doc) {
//   if (err) console.log(err);
//   else console.log("Inserted Successfully!");
// });

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
