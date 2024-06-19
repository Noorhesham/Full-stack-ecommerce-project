import { createHash, randomBytes } from "crypto";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
export interface UserProps extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string | undefined;
  passwordConfirm: string | undefined;
  passwordChangeAt: Date | number;
  photo: string;
  active: boolean;
  _id: string;
  role: "user" | "admin";
  passwordResetToken: String;
  confirmationToken:mongoose.Types.ObjectId
  googleAccessToken: String;
  passwordResetExpires: Date;
  wishlist?: string;
  isthirdParty?: boolean;
  phoneNumber: number;
  createdAt: Date;
  activatedAt:Date;
  isActivated: boolean;
}

const UserSchema = new Schema<UserProps>(
  {
    firstName: { type: String, required: [true, "please tell us your first name .."] },
    lastName: { type: String, required: [true, "please tell us your last name .."] },
    createdAt: { type: Date, default: Date.now() },
    email: {
      type: String,
      required: [true, "please provide your email .."],
      unique: true,
      lowerCase: true,
      validate: [validator.isEmail, "please provide a valid email.."],
    },
    photo: {
      type: String,
      default: ``,
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
      validate: {
        validator: function (this: UserProps, value: string) {
          // Skip validation if googleAccessToken is provided
          if (this.googleAccessToken) return true;
          return !!value;
        },
        message: "Please provide your password.",
      },
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (this: UserProps, value: string) {
          if (this.googleAccessToken) return true;
          return value === this.password;
        },
        message: "Passwords do not match.",
      },
    },
    passwordChangeAt: Date,
    role: { type: String, required: true, default: "user" },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    wishlist: [String],
    isthirdParty: { type: Boolean, default: false },
    isActivated: { type: Boolean, default: false },
    activatedAt: {type:Date},
    confirmationToken:{type: Schema.Types.ObjectId,ref:'Activation'}
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
UserSchema.pre("save", async function (next) {
  this.passwordConfirm = undefined;
  next();
});

//updating the password middleware
UserSchema.pre("save", function (next) {
  //i check if the password is not new or is not modified so it means that the password changed /updated
  if (this.googleAccessToken) return next();
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
