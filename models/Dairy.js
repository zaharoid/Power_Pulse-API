import mongoose from 'mongoose';
import { handleSaveError, runValidatorsAtUpdate } from './mongooseUtils';

const Dairy = new mongoose.Schema({
    owner: {
        type: String, // ID владельца
        required: [true, "Diary without owner? Something wrong is going on here. Fix this and come back:)"],
        unique: true
    },
    data: {
        tags: [Object]
    }    
})