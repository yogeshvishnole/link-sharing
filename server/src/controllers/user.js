import catchAsync from '../utils/catch-async';
import Link from '../models/link';
import User from '../models/user';

export const getUser = catchAsync(async (req, res, next) => {
  const links = await Link.find({ postedBy: req.user._id })
    .populate('categories', 'name')
    .populate('postedBy', 'name');
  return res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
      links,
    },
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, password, categories } = req.body;
  if (password && password.length < 6) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password must be at least 6 characters long.',
    });
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      name,
      categories,
    },
  );
  let newUser = updatedUser;
  if (password) {
    updatedUser.password = password;
    newUser = await updatedUser.save();
    newUser.hashed_password = undefined;
    newUser.salt = undefined;
    newUser.resetPasswordLInk = undefined;
  }

  return res.status(200).json({
    status: 'success',
    message: 'User updated successfully.',
    data: {
      user: newUser,
    },
  });
});
