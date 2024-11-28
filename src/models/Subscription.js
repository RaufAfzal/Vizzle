import mongoose, { Schema } from "mongoose";


const subscriptionSchema = new Schema({
    subscriber: {                    //to whom i have subscribed (the person currently logged in)
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    channel: {                       // who has subscribed me (the person who are not currently logged in )
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},
    {
        timestamps: true,
    }
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema); 