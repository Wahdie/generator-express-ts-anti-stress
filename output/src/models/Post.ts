import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {

  /** id field */
  id?: number;

  /** title field */
  title: string;

  /** content field */
  content: string;

  /** photo field */
  photo?: string;

  /** userId field */
  userId?: number;

  readonly createdAt: Date;
  readonly updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {

    id: {
      type: mongoose.Schema.Types.ObjectId,
      
        
      
    },

    title: {
      type: String,
      required: true,
      
      
    },

    content: {
      type: String,
      required: true,
      
      
    },

    photo: {
      type: String,
      
      
      
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
      
      
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

PostSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});



const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;