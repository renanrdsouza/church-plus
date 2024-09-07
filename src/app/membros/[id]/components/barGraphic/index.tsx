import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { IFinancialContribuition } from "@/models/modelsInterfaces";

interface IBarChartGraphicProps {
  financialContributions: IFinancialContribuition[];
}

const valueFormatter = (value: number | null) => `${value}`;

export default function BarsDataset(props: IBarChartGraphicProps) {
  const contributions = props.financialContributions.map((contribution) => {
    return {
      month: contribution.created_at?.toString().slice(5, 7),
      value: contribution.value,
    };
  });

  return (
    <BarChart
      slotProps={{
        loadingOverlay: { message: "Carregando..." },
        noDataOverlay: { message: "Nenhum dado a ser exibido" },
      }}
      dataset={contributions}
      xAxis={[
        {
          label: "Mês",
          scaleType: "band",
          data: [
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
          ],
        },
      ]}
      series={[{ dataKey: "value", label: "Valor em R$", valueFormatter }]}
    />
  );
}
