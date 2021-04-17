import Link from '../models/link';
import Category from '../models/category';
import User from '../models/user';
import catchAsync from '../utils/catch-async';
import Email from '../utils/email';

export const create = catchAsync(async (req, res, next) => {
  const { title, url, categories, type, medium } = req.body;
  const slug = url;
  const link = new Link({ title, url, slug, categories, type, medium });
  link.postedBy = req.user.id;
  const data = await link.save();

  res.status(201).json({
    status: 'success',
    message: 'Link created successfully.',
  });

  // find all users in the category
  const users = await User.find({ categories: { $in: categories } });

  const completeCategories = await Category.find({ _id: { $in: categories } });

  data.categories = completeCategories;

  for (let i = 0; i < users.length; i++) {
    // send email
    await new Email(users[i].email, '', data).sendNewLinkCreated();
  }
});

export const list = catchAsync(async (req, res, next) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  const links = await Link.find()
    .populate('categories', 'name slug')
    .populate('postedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    data: {
      links,
    },
  });
});

export const clickCount = catchAsync(async (req, res, next) => {
  const { linkId } = req.body;
  const link = await Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { new: true, upsert: true },
  );
  res.status(200).json({
    status: 'success',
    data: {
      link,
    },
  });
});

export const read = catchAsync(async (req, res, next) => {
  const { linkId } = req.params;

  const link = await Link.findById(linkId);

  res.status(200).json({
    status: 'success',
    data: {
      link,
    },
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { linkId } = req.params;

  const { title, url, categories, type, medium } = req.body;
  const toUpdate = { title, url, categories, type, medium };
  const updatedLinkData = await Link.findByIdAndUpdate(linkId, toUpdate, {
    new: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Link updated successfully',
    data: {
      link: updatedLinkData,
    },
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { linkId } = req.params;

  const deletedLink = await Link.findByIdAndRemove(linkId);

  res.status(204).json({
    status: 'success',
    message: 'Link deleted successfully',
  });
});

export const loggedUserAndAdminLinkActions = catchAsync(
  async (req, res, next) => {
    const { linkId } = req.params;
    const link = await Link.findById(linkId);
    if (link.postedBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        status: 'fail',
        message: 'You are not authorized to perform this action.',
      });
    }
    next();
  },
);

export const getPopularLinks = catchAsync(async (req, res, next) => {
  const trendingLinks = await Link.find()
    .populate('categories', 'name')
    .populate('postedBy', 'name')
    .sort({ clicks: -1 })
    .limit(3);
  return res.status(200).json({
    status: 'success',
    data: {
      data: trendingLinks,
    },
  });
});

export const getPopularLinksByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const trendingLinks = await Link.find({ categories: categoryId })
    .populate('categories', 'name')
    .populate('postedBy', 'name')
    .sort({ clicks: -1 })
    .limit(3);
  return res.status(200).json({
    status: 'success',
    data: {
      data: trendingLinks,
    },
  });
});
