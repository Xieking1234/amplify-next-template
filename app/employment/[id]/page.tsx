"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify/amplify_outputs.json";
import TextBorderAnimation from "@/components/animata/text/text-border-animation";
import UnderlineHoverText from "@/components/animata/text/underline-hover-text";
import PageWrapper from "@/components/animata/pagewrapper/page-wrapper";
import CalorieCounter from "@/components/animata/graphs/calorie-counter";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function EmploymentPage() {
    const params = useParams();
    const idParam = params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam; // ✅ FIX 1

    const [record, setRecord] = useState<Schema["Employment"]["type"] | null>(null);

    useEffect(() => {
        async function fetchRecord() {
            const { data } = await client.models.Employment.get({ id });
            setRecord(data);
        }
        fetchRecord();
    }, [id]);

    if (!record) return <div className="p-10">Loading...</div>;
    const toNumber = (value?: string | null) =>
        value ? Number(value.replace("%", "")) : 0;


    // Optional: ensure employment exists
    if (!record.employment) return <div className="p-10">No employment data found</div>;
    const uni = record.uniName
    const course = record.uniCourse
    const workOnly = record.employment?.workOnly
    const workAndStudy = record.employment?.workAndStudy
    const studyOnly = record.employment?.studyOnly
    const unemployment = record.employment?.unemployment
    const responseRate = record.employment?.responseRate
    return (
        <PageWrapper>
            <div className="flex justify-center mt-20">
                <UnderlineHoverText text={uni ?? ""
                } />
            </div>

            <div className="flex justify-center mt-20">
                <TextBorderAnimation text={course ?? ""
                } size="text-3xl" className="text-white" />
            </div>

            <div className="flex justify-center gap-10 mt-20">

                <CalorieCounter
                    goal={100}
                    percentage={toNumber(workOnly)}
                    image="/uni-Photoroom.png"
                    statDescription="Employment Rate"
                    description="Graduates who are Employed"
                />
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(workAndStudy)}
                    image="/uni-Photoroom.png"
                    statDescription="Internship Rate"
                    description="Graduates employed and pursuing higher studies"
                />
            </div>

            <div className="flex justify-center gap-10 mt-20">
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(studyOnly)}
                    image="/uni-Photoroom.png"
                    statDescription="Higher Study"
                    description="Graduates pursuing higher studies"
                />
                <CalorieCounter
                    goal={100}
                    percentage={toNumber(unemployment)}
                    image="/uni-Photoroom.png"
                    statDescription="Unemployment Rate"
                    description="Graduates who are Unemployed"
                />
            </div>



        </PageWrapper>
    );
}


