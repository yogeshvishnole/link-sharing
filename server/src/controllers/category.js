import slugify from 'slugify';
import { nanoid } from 'nanoid';
import s3 from '../services/aws-s3';
import Category from '../models/category';
import Link from '../models/link';
import catchAsync from '../utils/catch-async';
import BusinessError from '../exceptions/business-error';

export const create = catchAsync(async (req, res, next) => {
  const { name, content, image } = req.body;
  const slug = slugify(name);
  const postedBy = req.user.id;

  const category = new Category({ name, content, slug, postedBy });

  const base64Data = new Buffer.from(
    image.replace(/^data:image\/\w+;base64,/, ''),
    'base64',
  );
  const type = image.split(';')[0].split('/')[1];

  const s3Params = {
    Bucket: 'link-sharing',
    Key: `category/${nanoid()}.${type}`,
    Body: base64Data,
    ContentEncoding: 'base64',
    ACL: 'public-read',
    ContentType: `image/${type}`,
  };

  s3.upload(s3Params, async (err, s3Data) => {
    if (err) {
      console.log('ERROR', err);
      return next(new BusinessError('Image upload to AWS S3 failed', 500));
    }
    category.image.url = s3Data.Location;
    category.image.key = s3Data.key;
    let data;

    try {
      data = await category.save();
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        const value = err.errmsg.match(/"((?:\\.|[^"\\])*)"/);
        const message = `Duplicate field name : ${value[0]} . Please use another value`;
        return next(new BusinessError(message, 400));
      }
      return next(new BusinessError('Something went wrong', 500));
    }

    return res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        category: data,
      },
    });
  });
});
export const list = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  return res.status(200).json({
    status: 'success',
    data: {
      categories,
    },
  });
});
export const read = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  let limit = req.body.limit ? parseInt(req.body.limit) : 10;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  const category = await Category.findOne({ slug }).populate(
    'postedBy',
    'id name username',
  );

  if (!category) {
    return next(new BusinessError(`Category with ${slug} does not exist`, 404));
  }

  const links = await Link.find({ categories: category.id })
    .populate('postedBy', 'id name username')
    .populate('categories', 'name')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  res.status(200).json({
    status: 'success',
    data: {
      category,
      links,
    },
  });
});
export const update = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { name, content, image } = req.body;

  const updated = await Category.findOneAndUpdate(
    { slug },
    { name, content },
    { new: true },
  );

  if (image) {
    const deleteParams = {
      Bucket: 'link-sharing',
      Key: updated.image.key,
    };
    s3.deleteObject(deleteParams, (s3Err, s3Data) => {
      if (s3Err) console.log('S3 delete error during update', s3Err);
      else console.log('S3data after successful image delete', s3Data);
    });

    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    const type = image.split(';')[0].split('/')[1];

    const s3Params = {
      Bucket: 'link-sharing',
      Key: `category/${nanoid()}.${type}`,
      Body: base64Data,
      ContentEncoding: 'base64',
      ACL: 'public-read',
      ContentType: `image/${type}`,
    };

    s3.upload(s3Params, async (err, s3Data) => {
      if (err) {
        console.log('ERROR', err);
        return next(new BusinessError('Image upload to AWS S3 failed', 500));
      }
      updated.image.url = s3Data.Location;
      updated.image.key = s3Data.key;
      let data;

      try {
        data = await updated.save();
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          const value = err.errmsg.match(/"((?:\\.|[^"\\])*)"/);
          const message = `Duplicate field name : ${value[0]} . Please use another value`;
          return next(new BusinessError(message, 400));
        }
        return next(new BusinessError('Something went wrong', 500));
      }

      return res.status(200).json({
        status: 'success',
        message: 'Category updated successfully',
        data: {
          category: data,
        },
      });
    });
  } else {
    return res.status(200).json({
      status: 'success',
      message: 'Category updated successfully',
      data: {
        category: updated,
      },
    });
  }
});
export const remove = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const deletedCategory = await Category.findOneAndRemove({ slug });

  const deleteParams = {
    Bucket: 'link-sharing',
    Key: deletedCategory.image.key,
  };

  s3.deleteObject(deleteParams, (s3Err, s3Data) => {
    if (s3Err) console.log('S3 delete error during update', s3Err);
    else console.log('S3data after successful image delete', s3Data);
  });

  res.status(204).json({
    status: 'success',
    message: 'Catgory deleted successfully',
  });
});
