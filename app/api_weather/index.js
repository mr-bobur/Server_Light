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

              Device.findAll()
                .then(data => {
                  data.forEach(device => {
                    Device.update({ switch4: false }, { where: { id: device.id } });
                  });
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
  Device.update({ switch4: false }, { where: {} });

}, 300000);

// corn task for fixing 23.00 off atribute
setInterval(async function () {
  const date = new Date();
  const city = await City.findOne({ where: { name: 'test' } });
  if (city != null) {
    const ontime = city.offtime1;
    const offtime = city.ontime1; 
  // console.log({data: data, ontime: ontime, offtime: offtime});
    if (date.getHours()+5 == ontime.getHours() && date.getMinutes() == ontime.getMinutes()) {
      Device.update({ switch1: true, switch2: true, switch3: true, switch4: false, }, { where: { ctemp: 101 } }).then(result => {
        console.log(result);
        console.log("crontask fixing done");
      });
    }

    if (date.getHours()+5 == offtime.getHours() && date.getMinutes() == offtime.getMinutes()) {
      Device.update({ switch1: false, switch2: false, switch3: false, switch4: false, }, { where: { ctemp: 101 } }).then(result => {
        console.log(result);
        console.log("crontask fixing done");
      });
    }
  }

}, 20000);


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

            Device.update({
              aontime1: city.rasp1 ? city.ontime1 : city.onfix1,
              aofftime1: city.rasp1 ? city.offtime1 : city.offfix1,

              aontime2: city.rasp2 ? city.ontime2 : city.onfix2,
              aofftime2: city.rasp2 ? city.offtime2 : city.offfix2,

              aontime3: city.rasp3 ? city.ontime3 : city.onfix3,
              aofftime3: city.rasp3 ? city.offtime3 : city.offfix3,

            }, { where: { cityId: city.id } });

          }



        } catch (error) {
          console.log(error);
        }
      });
    });

}, 10000); // 5 sekunddan qurilmalarni avtomatik vaqtini shaharniki bn syncron qiladi

