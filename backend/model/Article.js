import mongoose from 'mongoose';

const { Schema } = mongoose;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
	published: {
        type: Date,
    },
	illustration: {
		type: String,
    },
	is_read: {
		type: Boolean,
		default: false,
		required: true,
	},
	feed_id: {
		type: Schema.Types.ObjectId,
		ref: 'Feed'
	},
});

export default mongoose.model('Article', articleSchema);