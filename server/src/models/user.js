import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      unique: true,
      index: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      max: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    hashed_password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    resetPasswordLink: {
      type: String,
      default: '',
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'subscriber'],
      default: 'subscriber',
    },
    passwordChangedAt: Date,
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema
  .virtual('password')
  .set(function (password) {
    // create a temp variable
    console.log('pass', password);
    this._password = password;
    // generate salt
    this.salt = this.makeSalt();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + '';
  },

  encryptPassword: function (password) {
    if (!password) return '';
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  },

  changedPasswordAfter: function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10,
      );
      // console.log(changedtimestamp, JWTTimestamp);
      return JWTTimeStamp < changedTimeStamp;
    }
    return false;
  },
};

const User = mongoose.model('User', userSchema);

export default User;
