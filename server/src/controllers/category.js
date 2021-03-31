import slugify from 'slugify';
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import fs from 'fs';
import formidable from 'formidable';
import { promisify } from 'util';
import Category from '../models/category';
import catchAsync from '../utils/catch-async';
import BusinessError from '../exceptions/business-error';
import { param } from 'express-validator';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const create = catchAsync(async (req, res, next) => {
  let form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(new BusinessError('Error in parsing the form data', 500));
    }

    const { name, content } = fields;
    const { image } = files;
    const slug = slugify(name);
    const category = new Category({ name, content, slug });

    if (image.size > '2000000') {
      return next(
        new BusinessError('Image size must be less than 2 mega bytes'),
      );
    }

    const s3Params = {
      Bucket: 'link-sharing',
      Key: `category/${nanoid()}`,
      Body: fs.readFileSync(image.path),
      ACL: 'public-read',
      ContentType: 'image/jpg',
    };

    s3.upload(s3Params, async (err, s3Data) => {
      if (err) {
        console.log('ERROR', err);
        return next(new BusinessError('Image upload to AWS S3 failed', 500));
      }
      category.image.url = s3Data.location;
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

  // const { name, content } = req.body;
  // const slug = slugify(name);
  // const image = {
  //   url: `https://via.placeholder.com/200*150.png?text=${process.env.CLIENT_URL}`,
  //   key: '123',
  // };
  // const postedBy = req.user.id;

  // const category = await Category.create({
  //   name,
  //   content,
  //   slug,
  //   image,
  //   postedBy,
  // });

  // return res.status(201).json({
  //   status: 'success',
  //   message: 'Category created successfully',
  //   data: {
  //     category,
  //   },
  // });
});
export const list = catchAsync(async (req, res, next) => {});
export const read = catchAsync(async (req, res, next) => {});
export const update = catchAsync(async (req, res, next) => {});
export const remove = catchAsync(async (req, res, next) => {});
