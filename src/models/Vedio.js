import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema(
    {
        vedioFile: {
            type: String,
            required: true
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        publishAt: {
            type: Date,
            required: false
        }
    },
    {
        timestamps: true
    }
)

//indexing on fields
vedioSchema.index({ title: 1 });
vedioSchema.index({ owner: 1 });
vedioSchema.index({ publishAt: 1 });

vedioSchema.plugin(mongooseAggregatePaginate)


export const Vedio = mongoose.model("Vedio", vedioSchema)