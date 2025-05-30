
import mongoose from 'mongoose';

const PopupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    photo: [{
        type: String,
        required: true,
      }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Popup = mongoose.model('Popup', PopupSchema);
export default Popup;
