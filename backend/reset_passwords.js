const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://delta:delta1234@cluster0.ejloejp.mongodb.net/vehicle-management');
const db = mongoose.connection;

db.once('open', async () => {
    try {
        const Collection = mongoose.connection.db.collection('users');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await Collection.updateMany(
            { email: { $in: ['admin@fleet.com', 'manager@fleet.com', 'staff@fleet.com', 'user@fleet.com'] } },
            { $set: { password: hashedPassword } }
        );
        console.log('Passwords reset to: password123');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
});
