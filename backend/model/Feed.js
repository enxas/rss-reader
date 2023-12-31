import mongoose from 'mongoose';

const { Schema } = mongoose;

const feedSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
	category: {
		type: Schema.Types.ObjectId,
		ref: 'Category'
	},
});

export default mongoose.model('Feed', feedSchema);