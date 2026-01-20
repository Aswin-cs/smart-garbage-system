import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    geolocation: {
        latitude: { type: String, required: true },
        longitude: { type: String, required: true }
    }
})

const Location = mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
