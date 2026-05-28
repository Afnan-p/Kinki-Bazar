const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://afnaneduzone_db_user:Kinki12345@cluster0.wfgef1k.mongodb.net/kinki-bazar?retryWrites=true&w=majority&appName=Cluster0')
.then(async () => {
  const user = await User.findOne({ email: 'naseer@gmail.com' });
  if(user) {
    user.password = '123456';
    await user.save();
    console.log('Password updated to 123456');
  } else {
    console.log('User not found');
  }
  process.exit();
});
