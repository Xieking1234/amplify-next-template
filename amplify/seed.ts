import { readFileSync } from "fs";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "./data/resource";

const outputs = JSON.parse(
    readFileSync("../ss/amplify-next-template/amplify_outputs.json", "utf8")
);

Amplify.configure(outputs);

const client = generateClient<Schema>();



async function seed() {
    await client.models.Employment.create({
        uniId: "1",
        uniName: "University of Colchester",
        uniCourse: "Mechanical engineering ",
        employment: {
            workOnly: "71%",
            responseRate: "39%",
            workAndStudy: "23%",
            studyOnly: "52%",
            unemployment: "2%",
        },
    });

    console.log("Seed complete");
}

seed();


