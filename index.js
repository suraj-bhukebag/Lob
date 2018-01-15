var prompt = require('prompt');
var Lob = require('lob')('test_28eec4acc56136bce4e1b7b6d21ac270072');
var fetch = require("node-fetch");

let API_URL = "https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyB-CBiYS3PWF3_ydn_rxcVQ0TGwW8jB7wc&"

var schema = {
    properties: {
      name: {
        description: "Enter Name",
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      addressline1: {
        description: "Enter Address Line 1",
        required: true,
        message: "Address cannot be empty"
      },
      addressline2: {
        required: false
      },
      city: {
        description: "Enter City",
        pattern: /^[a-zA-Z\s\-]+$/,
        message: "City cannot be empty",
        required: true
      },
      state: {
        description: "Enter State",
        pattern: /^[a-zA-Z\s\-]+$/,
        message: "State cannot be empty",
        required: true
      },
      zipcode: {
        description: "Enter Zipcode",
        pattern: /^[0-9]+$/,
        message: "Zip Code cannot be empty",
        required: true
      },
      message: {
        required: true,
        message :"Message cannot be empty or Message length is greater than 500 characters.",
        conform: function (value) {
        if(value.length > 5) {
          return false;
        }  
        return true;
      }
      }
    }
  };
 

prompt.start();


prompt.get(schema, function(err, result) {

  if(!err) {
    console.log('Command-line input received:');

    let address = result.addressline1;
    let query = "address="+ address + "&levels=country&roles=legislatorUpperBody";

    fetch(`${API_URL}${query}`)
        .then(response => {
            response.json().then(json => {
                if(json.officials === undefined) {
                  console.log("Invalid Address");
                }
                else {
                  let official = json.officials[0];
                  let ofName = official.name;
                  let offAddress = official.address[0];
                  let ofAddress1 = offAddress.line1;
                  let ofAddress2 = offAddress.line2;
                  let ofCity = offAddress.city;
                  let ofState = offAddress.state;
                  let ofZip = offAddress.zip;
                  Lob.letters.create({
                    description: 'Lob Challenge',
                    from: {
                        name: result.name,
                        address_line1: result.addressline1,
                        address_line2: result.addressline2,
                        address_city: result.city,
                        address_state: result.state,
                        address_zip: result.zipcode,
                        address_country: 'US',
                    },
                    to: {
                        name: ofName,
                        address_line1: ofAddress1,
                        address_line2: ofAddress2,
                        address_city: ofCity,
                        address_state: ofState,
                        address_zip: ofZip,
                        address_country: 'US',
                    },
                    file: 'tmpl_3a95010e38f908a',
                    merge_variables: {
                        message: result.message
                    },
                    color: true
                }, function(err, res) {
                    if(err) {
                      console.log("Error in sending Letter\n")
                      console.log("ERROR DETAILS -----------------------------------------\n");
                      console.log(err);
                      console.log("-------------------------------------------------------");
                    }
                    else {
                    console.log("Url : "+res.url)  
                    }
                    
                });
                }

            });
        })
        .catch(error => {
            console.log("Error in Fetching address \n");
            console.log("ERROR DETAILS -----------------------------------------\n");
            console.log(error);
            console.log("-------------------------------------------------------");
        });


  }
  else {
    console.log('Error in receiving Command-line input ');
  }
});