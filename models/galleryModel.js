import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;