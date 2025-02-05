import { createHash, randomBytes } from "crypto";
import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface UserProps extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Making it optional
  passwordConfirm?: string; // Making it optional
  passwordChangeAt?: Date | number;
  photo:  {imgUrl:string,publicId:string};
  image: string;
  _id: string;
  active: boolean;
  city: string;
  id: String;
  role: "user" | "admin";
  passwordResetToken?: string;
  confirmationToken?: mongoose.Types.ObjectId;
  googleAccessToken?: string;
  passwordResetExpires?: Date;
  cart?: string[];
  isthirdParty?: boolean;
  phoneNumber?: string;
  createdAt: Date;
  activatedAt?: Date;
  isAdmin: boolean;
  isActivated: boolean;
  stripeAccountId?: string;
  address?: string;
  country?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

const UserSchema = new Schema<UserProps>(
  {
    firstName: { type: String, required: [true, "Please tell us your first name."] },
    lastName: { type: String, required: [true, "Please tell us your last name."] },
    createdAt: { type: Date, default: Date.now },
    email: {
      type: String,
      required: [true, "Please provide your email."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    photo: { imgUrl: String, publicId: String },
    password: {
      type: String,
      required: function () {
        return !this.isthirdParty;
      },
      select: false,
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (this: UserProps, value: string) {
          if (this.isthirdParty) return true;
          return value === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    passwordChangeAt: Date,
    role: { type: String, default: "user" },
    active: { type: Boolean, default: true, select: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    cart: {
      type: [
        {
          productId: { type: Schema.Types.ObjectId, ref: "Product" },
          variants: [String],
        },
      ],
      ref: "Product",
    },
    isthirdParty: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: false },
    activatedAt: Date,
    phoneNumber: { type: Number },
    confirmationToken: { type: Schema.Types.ObjectId, ref: "Activation" },
    isAdmin: { type: Boolean, default: false },
    stripeAccountId: { type: String },
    address: { type: String },
    city: { type: String },
    location: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function (next) {
  this.passwordConfirm = undefined;
  next();
});

UserSchema.pre("save", function (next) {
  if (this.isthirdParty) return next();
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeAt = Date.now() - 1000;
  next();
});

UserSchema.pre("findOne", function (this: any, next) {
  this.find({ active: { $ne: false } });
  next();
});

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = randomBytes(32).toString("hex");
  this.passwordResetToken = createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.models.User || mongoose.model<UserProps>("User", UserSchema);
export default User;
