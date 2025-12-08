"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";
import { Cell, Pie, PieChart as RechartsPieChart } from "recharts";

interface FilmPieChartProps {
    title: string;
    description?: string;
    data: Array<{ name: string; value: number }>;
    colors?: string[];
}

const DEFAULT_COLORS = [
    "hsl(200, 90%, 55%)",
    "hsl(215, 85%, 50%)",
    "hsl(190, 85%, 55%)",
    "hsl(175, 70%, 45%)",
    "hsl(155, 70%, 45%)",
    "hsl(260, 70%, 60%)",
    "hsl(240, 65%, 55%)",
    "hsl(225, 70%, 60%)",
];

export function FilmPieChart({
    title,
    description,
    data,
    colors = DEFAULT_COLORS,
}: FilmPieChartProps) {
    const chartConfig: ChartConfig = data.reduce((acc, item, index) => {
        acc[item.name] = {
            label: item.name,
            color: colors[index % colors.length],
        };
        return acc;
    }, {} as ChartConfig);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent className="flex-1 pb-6">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px] w-full"
                >
                    <RechartsPieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                    </RechartsPieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
