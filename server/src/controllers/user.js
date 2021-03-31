import catchAsync from '../utils/catch-async';

export const getUser = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});
