const db = require("../models");
const City = db.cities;
const Op = db.Sequelize.Op;


setInterval(async function () { 

  City.findAll()
    .then(data => {
      const cities = data;

      cities.forEach(city => {

        try {
          // request boshlanish joyi
          var request = require("request");
          var options = {
            method: 'GET',
            url: 'http://api.openweathermap.org/data/2.5/weather',
            qs:
            {
              lat: city.longitude,
              lon: city.latitude,
              appid: 'bb85435372d63f24078b193721636dcb'
            }
          };

          request(options, function (error, response, body) {
            try {
              var body1 = JSON.parse(body);
              var sun = body1.sys;
              //console.log(body1);
              city.sunset = new Date((sun.sunset + body1.timezone) * 1000);
              city.sunrise = new Date((sun.sunrise + body1.timezone) * 1000);
              city.visiblity = body1.visibility;
              City.update(city.dataValues, { where: { id: city.id } }).then(data => {
                if (data == 1) {
                  console.log([city.name, city.visiblity]);
                  console.log([city.name, "Sunrise and sunset Updated Successfuly"]);
                }
                else
                  console.log([city.name, "Sunrise and sunset Updating FAIL"]);

              });


            } catch (error1) {
            }
          });
        } catch (error) {
          console.log("So`rov yuboroshda xatolik bor");
        }
      });
    });

}, process.env.W_API_UPDATING_TIME || 50000);
