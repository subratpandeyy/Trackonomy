import { Cell, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

interface RadialVariantProps {
  data: {
    name: string;
    value: number;
  }[];
}

export const RadialVariant = ({ data }: RadialVariantProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadialBarChart
        cx="50%"
        cy="50%"
        barSize={10}
        innerRadius="90%"
        outerRadius="40%"
        data={data.map((item, index) => ({
          ...item,
          fill: `hsl(${index * 45}, 70%, 50%)`,
        }))}
      >
        <RadialBar
          label={{ position: "insideStart", fill: "#fff" }}
          background
          dataKey="value"
        />
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
        ))}
      </RadialBarChart>
    </ResponsiveContainer>
  );
};