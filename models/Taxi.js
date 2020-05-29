const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PointSchema = new Schema({
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" }, //[lng, lat] mongodb uses longitude first
});

const OwnerSchema = new Schema({
    name: { type: String, required: true },
    experience: { type: Number, required: true },
});

const TaxiSchema = new Schema({
    brand: { type: String, required: [true, "Brand is required."] },
    model: { type: String, required: true },
    year: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => {
                return /^[0-9]{4}$/.test(value);
            },
            message: (props) => `${props.value} is not a valid year!`,
        },
    },
    owner: OwnerSchema,
    geometry: PointSchema,
});

module.exports = mongoose.model("taxi", TaxiSchema);
