import { User } from '../models/User.js';

export const authController = {
  async syncUser(req, res, next) {
    try {
      const { name, email, phone, language, location, avatar } = req.body;
      const firebaseUid = req.user?.firebaseUid || req.body.firebaseUid || `usr_${Date.now()}`;

      let user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (language) user.language = language;
        if (location) user.location = location;
        if (avatar) user.avatar = avatar;
        await user.save();
      } else {
        user = await User.create({
          firebaseUid,
          name: name || email.split('@')[0],
          email: email.toLowerCase(),
          phone: phone || '',
          role: email.includes('admin') ? 'admin' : 'citizen',
          language: language || 'en',
          location: location || 'Chennai, Tamil Nadu',
          avatar: avatar || '',
        });
      }

      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      res.status(200).json({ success: true, user: req.user });
    } catch (err) {
      next(err);
    }
  },

  async updateMe(req, res, next) {
    try {
      const { name, phone, language, location, avatar } = req.body;
      const user = req.user;

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (language) user.language = language;
      if (location) user.location = location;
      if (avatar) user.avatar = avatar;

      await user.save();
      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
};
