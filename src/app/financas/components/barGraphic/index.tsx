import { BarChart } from "@mui/x-charts/BarChart";

interface ContributionsProps {
  contributions: {
    id: string;
    created_at: string;
    updated_at: string;
    value: number;
    type: string;
    member_id: string;
  }[];
}

const valueFormatter = (value: number | null) =>
  value !== null ? value.toFixed(2).replace(".", ",") : "";

const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const generateDataArrayFromBarChart = (contributions: any[]) => {
  const dataByMonth: { [key: string]: number } = {};

  contributions.forEach((contribution) => {
    const date = new Date(contribution.updated_at);
    const month = monthNames[date.getMonth()];
    if (!dataByMonth[month]) {
      dataByMonth[month] = 0;
    }
    dataByMonth[month] += contribution.value / 100;
  });

  const currentMonthIndex = new Date().getMonth();
  const orderedMonths = [
    ...monthNames.slice(currentMonthIndex + 1),
    ...monthNames.slice(0, currentMonthIndex + 1),
  ];

  return orderedMonths.map((month) => ({
    month,
    value: dataByMonth[month] || 0,
  }));
};

export default function BarsDataset({ contributions }: ContributionsProps) {
  if (!contributions || contributions.length === 0) {
    return <div>Nenhum dado a ser exibido</div>;
  }

  const sortedContributionsByUpdatedAt = contributions.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );

  const chartData = generateDataArrayFromBarChart(
    sortedContributionsByUpdatedAt,
  );

  return (
    <BarChart
      slotProps={{
        loadingOverlay: { message: "Carregando..." },
        noDataOverlay: { message: "Nenhum dado a ser exibido" },
      }}
      dataset={chartData}
      xAxis={[
        {
          label: "Mês",
          scaleType: "band",
          data: chartData.map((d) => d.month),
          colorMap: {
            type: "ordinal",
            colors: ["#475569"],
          },
        },
      ]}
      series={[
        {
          dataKey: "value",
          label: "Valor em R$",
          valueFormatter,
          color: "#475569",
        },
      ]}
    />
  );
}
