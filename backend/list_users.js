const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://delta:delta1234@cluster0.ejloejp.mongodb.net/vehicle-management');
const db = mongoose.connection;
db.once('open', async () => {
    const Collection = mongoose.connection.db.collection('users');
    const users = await Collection.find({}).toArray();
    console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role, name: u.name })), null, 2));
    process.exit(0);
});
