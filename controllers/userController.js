exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    message: "User Profile",
  });
};

exports.updateProfile = async (req, res) => {
  res.json({
    success: true,
    message: "Profile Updated",
  });
};