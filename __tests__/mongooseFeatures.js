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

describe("mongoose features", () => {
    test("default validation", async () => {
        try {
            let company = new Company();
            await company.save();
        } catch (err) {
            expect(err.message).toBe(
                "company validation failed: name: Path `name` is required."
            );
        }
    });

    test("custom validation simple", async () => {
        try {
            let taxi = new Taxi();
            //taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 2015;
            taxi.owner = { name: "Driver 1", experience: 15 };
            taxi = await taxi.save();
        } catch (err) {
            expect(err.message).toBe(
                "taxi validation failed: brand: Brand is required."
            );
        }
    });

    test("custom validation advanced", async () => {
        try {
            var taxi = new Taxi();
            taxi.brand = "Toyota";
            taxi.model = "Yaris";
            taxi.year = 111;
            taxi.owner = { name: "Driver 1", experience: 15 };
            taxi = await taxi.save();
        } catch (err) {
            expect(err.message).toBe(
                `taxi validation failed: year: ${taxi.year} is not a valid year!`
            );
        }
    });

    test("post save middleware", async () => {
        try {
            let company = new Company();
            company.name = "throw error name";
            await company.save();
        } catch (err) {
            expect(err.message).toBe(`New Test Error`);
        }
    });

    test("pre save middleware", async () => {
        try {
            let company = new Company();
            company.name = "Mark's Company!!!";
            await company.save();

            const readCompany = await Company.findOne();
            expect(readCompany.name).toBe("Marks Company");
        } catch (err) {
            console.log(err);
        }
    });

    test("pre remove middleware", async () => {
        try {
            let company = new Company();
            company.name = "First Company";
            await company.save();

            var taxi1 = new Taxi();
            taxi1.brand = "Toyota";
            taxi1.model = "Yaris";
            taxi1.year = 2015;
            taxi1.owner = { name: "Driver 1", experience: 15 };
            taxi1 = await taxi1.save();

            var taxi2 = new Taxi();
            taxi2.brand = "Toyota";
            taxi2.model = "Yaris";
            taxi2.year = 2015;
            taxi2.owner = { name: "Driver 2", experience: 7 };
            taxi2 = await taxi2.save();

            company.taxies = [taxi1.id, taxi2.id];
            company = await company.save();

            const taxiCount = await Taxi.countDocuments();
            expect(taxiCount).toBe(2);

            await company.delete();

            const newTaxiCount = await Taxi.countDocuments();
            expect(newTaxiCount).toBe(0);
        } catch (err) {
            console.log(err);
        }
    });
});
