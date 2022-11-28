const express = require("express");
const bodyParser=require("body-parser");
const request= require("request");
const https=require("https");

const app=express();
const port=3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){

  res.sendFile(__dirname+"/signup.html")
});

app.get("/success",function(req,res){

  res.sendFile(__dirname+"/success.html")
});

app.post("/failure",function(req,res){

  res.sendFile(__dirname+"/failure.html")
});


app.post("/",function(req,res){

  const firstName=req.body.firstName;
  const lastName=req.body.lastName;
  const email=req.body.email;

  console.log("First Name: "+firstName+" last name: "+lastName+" Email: "+email);
  var data={
    members:[
      {
        email_address:email,
        status:"subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME:lastName
        }
      }
    ]
  };

  var jsonData=JSON.stringify(data);   // Lo pasamos a formato de String

  const url = "https://us21.api.mailchimp.com/3.0/lists/799d5a4903";  // La URL con nuestro ID al final
  const options = {
    method:"POST",
    auth:"gonzalo:59b7478d2754c739a2983679e525556e-us21",
  };

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      console.log(JSON.parse(data));  // Mostramos en formato json la info recibida

      console.log("El estatus es:"+ response.statusCode);

      if (response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
      }else{
        res.sendFile(__dirname+"/failure.html");
      }


    });
  } );

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || port, function(){
  console.log("server is running on port 3000");
});

///    API KEY
///  59b7478d2754c739a2983679e525556e-us21

//     List ID
//  799d5a4903
