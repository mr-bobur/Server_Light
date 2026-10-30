const db = require("./app/models");
const bcrypt = require("bcryptjs");

async function seed() {
  await db.sequelize.sync();
  
  await db.role.findOrCreate({ where: { id: 1 }, defaults: { id: 1, name: "user" } });
  await db.role.findOrCreate({ where: { id: 2 }, defaults: { id: 2, name: "moderator" } });
  await db.role.findOrCreate({ where: { id: 3 }, defaults: { id: 3, name: "admin" } });
  
  const [user, created] = await db.user.findOrCreate({
    where: { username: "boburshah" },
    defaults: {
      username: "boburshah",
      email: "bmatyoquboff@gmail.com",
      password: bcrypt.hashSync("acdb2022", 8)
    }
  });

  if (!created) {
    user.password = bcrypt.hashSync("acdb2022", 8);
    await user.save();
  }

  const roles = await db.role.findAll();
  await user.setRoles(roles);

  console.log("Seeding complete! User boburshah / acdb2022 ready.");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
