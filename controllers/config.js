const Config = require('../models/Config');

const checkAppSetup = async (req, res) => {
  const config = await Config.findOne();
  if (!config) {
    const newConfig = new Config({
      adminCreated: false,
      imageOrderCreated: false,
    });
    newConfig.save();
    return res.status(200).json({ status: 'Initial setup completed' });
  }
  return res.status(200).json({ status: 'App has already been initialized' });
};

const checkAdminPresence = async (req, res) => {
  const config = await Config.findOne({});
  if (!config?.adminCreated) {
    return res.status(200).json({ status: 'admin not present' });
  }
  res.status(200).json({ status: 'admin created' });
};

const createAdmin = async (req, res) => {
  const { email, password } = req.body;
  const config = await Config.findOne();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      error: 'email must be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
};

module.exports = {
  checkAppSetup,
  checkAdminPresence,
  createAdmin,
};
