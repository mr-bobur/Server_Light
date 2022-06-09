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

      cities.forEach(city => {
        try {
          Device.update({ 

            aontime1: city.rasp1 ? city.onfix1 : city.ontime1,
            aofftime1: city.rasp1 ? city.offfix1 : city.offtime1,

            aontime2: city.rasp2 ? city.onfix2 : city.ontime2,
            aofftime2: city.rasp2 ? city.offfix2 : city.offtime2,

            aontime3: city.rasp3 ? city.onfix3 : city.ontime3,
            aofftime3: city.rasp3 ? city.offfix3 : city.offtime3,

          }, { where: { citiId: city.id } }); 
        } catch (error) {
          console.log("Shahar topilmadi");
        }
      });
    });

}, 5000); // 5 sekunddan qurilmalarni avtomatik vaqtini shaharniki bn syncron qiladi

