const db = require("../models");
const City = db.cities;
const Device = db.devices;

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
              console.log(body1.sys);
              city.sunset = new Date((sun.sunset + body1.timezone) * 1000);
              city.sunrise = new Date((sun.sunrise + body1.timezone) * 1000);
              city.visiblity = body1.visibility;
              City.update(city.dataValues, { where: { id: city.id } }).then(data => {
                if (data == 1) {
                  // console.log([city.name, city.visiblity]);
                  // console.log([city.name, "Sunrise and sunset  O`rntaildi"]);
                }
                else
                  console.log([city.name, "Sunrise and sunset Updating XATOLIK"]);

              });


            } catch (error1) {
            }
          });
        } catch (error) {
          console.log("So`rov yuboroshda xatolik bor");
        }
      });
    });

}, process.env.W_API_UPDATING_TIME || 1600000);



setInterval(async function () {

  Device.update({ status: false }, { where: {} });

}, 60000); // har 1 minutdan update bomasa hammasini stuatuslarini false qiladi!


 
setInterval(async function () {
  // console.log("kron tasks");
  City.findAll()
    .then(data => {
      const cities = data;
      const date1 = new Date();
      date1.setUTCHours(00, 00, 02);
      const date2 = new Date();
      date2.setUTCHours(23, 59, 58);

      var aontime1 = new Date();
      var aontime2 = new Date();
      var aontime3 = new Date();

      var aofftime1 = new Date();
      var aofftime2 = new Date();
      var aofftime3 = new Date();

    

      cities.forEach(city => {
        try {
          if (!city.automatic) {
            aontime1 = date1;
            aofftime1 = date1;

            aontime2 = date1;
            aofftime2 = date1;
            
            aontime3 = date1;
            aofftime3 = date1;

            if (!city.switch1) {
              aontime1 = date2;
            }
            if (!city.switch2) {
              aontime2 = date2;
            }
            if (!city.switch3) {
              aontime3 = date2;
            }
            Device.update({
              aontime1, aofftime1,
              aontime2, aofftime2,
              aontime3, aofftime3
            }, { where: { cityId: city.id } });

          } else {
            

            if (city.rasp1) {
              aontime1 = city.onfix1;
              aofftime1 = city.offfix1;
            } else {
              aontime1 = city.ontime1;
              aofftime1 = city.offtime1;
            } 
            if (city.rasp2) {
              aontime2 = city.onfix2;
              aofftime2 = city.offfix2;
            } else {
              aontime2 = city.ontime2;
              aofftime2 = city.offtime2;
            }

            if (city.rasp3) {
              aontime3 = city.onfix3;
              aofftime3 = city.offfix3;
            } else {
              aontime3 = city.ontime3;
              aofftime3 = city.offtime3;
            }

            Device.update({ 
               aontime1, aofftime1,
               aontime2, aofftime2,
               aontime3, aofftime3
            }, { where: { cityId: city.id } });

          }

          console.log({ 
            aontime1: aontime1, aofftime1: aofftime1,
            aontime2: aontime2, aofftime2: aofftime2,
            aontime3: aontime3, aofftime3: aofftime3
          });

         

        } catch (error) {
          console.log(error);
        }
      });
    });

}, 5000); // 5 sekunddan qurilmalarni avtomatik vaqtini shaharniki bn syncron qiladi

