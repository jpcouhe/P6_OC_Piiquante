const User = require("../database/models/user.models");

exports.createUser = async (body) => {
    try {
        const password = body.password;
        const hashedPassword = await User.hashPassword(password);
        const user = new User({
            email: body.email,
            password: hashedPassword,
        });
        return user.save();
    } catch (error) {
        res.status(500).json({ error });
    }
};

exports.findUserAndComparePassword = async (body) => {
    try {
        const emailUser = body.email;
        const user = await User.findOne({ email: emailUser });
        const valid = await User.comparePassword(body.password, user.password);
        if (!valid) {
            return false;
        } else {
            return user;
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};
