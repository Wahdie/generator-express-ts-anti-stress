import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {

  /** id field */
  id?: number;

  /** name field */
  name: string;

  /** email field */
  email: string;

  /** password field */
  password: string;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {

    id: {
      type: mongoose.Schema.Types.ObjectId, 
    },

    name: {
      type: String,
      required: true,
      
      
    },

    email: {
      type: String,
      required: true,
      unique: true,
      
    },

    password: {
      type: String,
      required: true,
      
      
    },

  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);


// Virtual Populate for Relationships

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'userId',
  justOne: false
});



const User = mongoose.model<IUser>('User', UserSchema);

export default User;