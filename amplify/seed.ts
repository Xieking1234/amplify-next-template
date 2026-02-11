import { readFileSync } from "fs";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "./data/resource";

const outputs = JSON.parse(
    readFileSync("./amplify_outputs.json", "utf8")
);

Amplify.configure(outputs);

const client = generateClient<Schema>();



async function seed() {
    await client.models.Employment.create({
        uniId: "1",
        uniName: "University of Oxford",
        uniCourse: "Computer Science",
        employment: {
            workOnly: "40%",
            responseRate: "90%",
            workAndStudy: "30%",
            studyOnly: "20%",
            unemployment: "10%",
        },
    });

    console.log("Seed complete");
}

seed();


