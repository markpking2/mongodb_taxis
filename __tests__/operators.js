const mongoose = require("mongoose");
const Company = require("../models/Company");
const Taxi = require("../models/Taxi");

beforeAll(() => {
    mongoose.connect("mongodb://localhost/taxi-aggregator", {
        useNewUrlParser: true,
        useCreateIndex: true,
    });
});

beforeEach(async () => {});

afterEach(async () => {
    await Company.deleteMany({});
    await Taxi.deleteMany({});
});

afterAll((done) => {
    mongoose.disconnect(done);
});

describe("mongo operators tests", () => {
    test("$gt and $lt", async () => {
        // create 5 taxies
        for (let i = 1; i <= 5; i++) {
            let taxi = new Taxi();
            taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 2015;
            taxi.owner = { name: `Driver ${i}`, experience: i * 5 };
            await taxi.save();
        }

        const count = await Taxi.countDocuments();
        expect(count).toBe(5);

        const readTaxies = await Taxi.find({
            "owner.experience": { $gt: 6, $lt: 21 },
        });
        expect(readTaxies.length).toBe(3);
    });

    test("$in", async () => {
        // create 5 taxies
        for (let i = 1; i <= 5; i++) {
            let taxi = new Taxi();
            taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 2015;
            taxi.owner = { name: `Driver ${i}`, experience: i * 5 };
            await taxi.save();
        }

        const taxies = await Taxi.find({
            "owner.experience": { $in: [5, 15, 25, 30] },
        });
        expect(taxies.length).toBe(3);
    });

    test("$and and $or", async () => {
        let taxi = new Taxi();
        taxi.brand = "Toyota";
        taxi.model = "Yaris";
        taxi.year = 2015;
        taxi.owner = { name: "Driver 1", experience: 5 };
        await taxi.save();

        const readTaxiAnd = await Taxi.find({
            $and: [{ brand: "Toyota" }, { "owner.experience": 6 }],
        });

        expect(readTaxiAnd.length).toBe(0);

        const readTaxiOr = await Taxi.find({
            $or: [{ brand: "Toyota" }, { "owner.experience": 6 }],
        });

        expect(readTaxiOr.length).toBe(1);
    });

    //update
    test("$inc", async () => {
        let taxi = new Taxi();
        taxi.brand = "Toyota";
        taxi.model = "Yaris";
        taxi.year = 2015;
        taxi.owner = { name: "Driver 1", experience: 5 };
        await taxi.save();

        await Taxi.updateOne({ _id: taxi.id }, { $inc: { year: 2 } });

        const updatedTaxi = await Taxi.findById(taxi.id);
        expect(updatedTaxi.year).toBe(2017);
    });
});
