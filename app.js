const exp = require("constants");
const express = require("express");
const https = require("https");
const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName, lastName, email)
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/7176328d33"
  const options = {
    method: "post",
    auth: "shubham:e2a49754b7bb3b1f6d0e80910425547e-us20"
  }

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();

})

app.post("/failure.html", function (req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
  console.log("Server listening at port 3000.")
})
//apikey: e2a49754b7bb3b1f6d0e80910425547e-us20
//list id: 7176328d33