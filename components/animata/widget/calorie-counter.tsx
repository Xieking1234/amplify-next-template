"use client";
import DonutChart from "@/components/animata/graphs/donut-chart";

interface ICalorieCounterProps {
    goal: number;
    percentage: number;
    image: string;
    description: string;
    statDescription: string;
}

export const testCalorieCounterProps: ICalorieCounterProps = {
    goal: 4000,
    percentage: 120,
    image:
        "https://plus.unsplash.com/premium_vector-1689096672037-98309fdc7f44?bg=FFFFFF&q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    description: "about uni",
    statDescription: "employement rate",
};

function CalorieCounter({
                                           goal = testCalorieCounterProps.goal,
                                           percentage = testCalorieCounterProps.percentage,
                                           image = testCalorieCounterProps.image,
                                           description = testCalorieCounterProps.description,
                                           statDescription = testCalorieCounterProps.statDescription,
                                       }: ICalorieCounterProps) {
    return (
        <>
            <div
                className="calorie-container relative flex h-96 w-52 flex-col items-center justify-start gap-4 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:hover:shadow-[0_0_25px_rgba(0,255,180,0.4)] sm:w-72 cursor-pointer">
                <div className="day-date flex w-full flex-row items-center justify-between pt-2">
                    <div>

                        <p className=" date font-md text-xl dark:text-white">{statDescription}</p>
                    </div>
                    <img alt="image" src={image} className="h-10 w-10 rounded-full"/>
                </div>
                <DonutChart
                    progress={(percentage / goal) * 100}
                    circleWidth={18}
                    progressWidth={18}
                    size={180}
                    progressClassName="dark:text-green text-green-400"
                    className="relative m-2 flex items-center justify-center"
                />
                <div
                    className="goal absolute bottom-8 flex h-14 w-56 items-center justify-between rounded-xl border border-white/30 bg-white/20 backdrop-blur-md px-4 sm:w-64">
                    <p className="flex justify-center font-bold dark:text-white">{description}</p>
                </div>
                <div className="fulfilled absolute top-40 flex flex-col items-center">
                    <p className=" font-md text-xl dark:text-white">{percentage}%</p>
                </div>
            </div>
        </>
    )
}
    export default CalorieCounter