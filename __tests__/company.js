const mongoose = require("mongoose");
const Company = require("../models/Company");

let company;

beforeAll(() => {
    mongoose.connect("mongodb://localhost/taxi-aggregator", {
        useNewUrlParser: true,
        useCreateIndex: true,
    });
});

beforeEach(async () => {
    company = new Company();
    company.name = "First Company";
    company = await company.save();
});

afterEach(async () => {
    await Company.deleteMany({});
});

afterAll((done) => {
    mongoose.disconnect(done);
});

describe("company tests", () => {
    test("create company", async () => {
        const count = await Company.countDocuments();
        expect(count).toBe(1);
    });

    test("read company", async () => {
        const readCompany = await Company.findById(company.id);
        expect(readCompany.name).toBe(company.name);
    });

    test("update company", async () => {
        await Company.updateOne({ _id: company.id }, { name: "Updated name" });
        const readCompany = await Company.findById(company.id);
        expect(readCompany.name).toBe("Updated name");
    });

    test("delete company", async () => {
        const count = await Company.countDocuments();
        expect(count).toBe(1);

        await Company.deleteOne({ _id: company.id });

        const newCount = await Company.countDocuments();
        expect(newCount).toBe(0);
    });
});
