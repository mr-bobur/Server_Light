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
          City.findByPk(city.id, { include: ["devices"] })
            .then(data => {
              if (data) {
                res.send(data.devices);
                //cities onfix2
                //device aontime1
                Device.update({
                  aontime1: data.rasp1 ? data.onfix1 : data.ontime1,
                  aofftime1: data.rasp1 ? data.offfix1 : data.offtime1,

                  aontime2: data.rasp2 ? data.onfix2 : data.ontime2,
                  aofftime2: data.rasp2 ? data.offfix2 : data.offtime2,

                  aontime3: data.rasp3 ? data.onfix3 : data.ontime3,
                  aofftime3: data.rasp3 ? data.offfix3 : data.offtime3,
                
                }, { where: { citiId: data.id } });

              }  
            })
            .catch(err => {
              console.log("So`rov yuboroshda xatolik bor");
            });

        } catch (error) {
          console.log("So`rov yuboroshda xatolik bor");
        }
      });
    });

}, 5000); // 5 sekunddan qurilmalarni avtomatik vaqtini shaharniki bn syncron qiladi

