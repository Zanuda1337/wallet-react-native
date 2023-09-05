import React, { useMemo, useState } from "react";
import Charts from "src/components/charts/Charts";
import { getDynamics } from "src/utils";
import moment from "moment";
import { useAppSelector } from "src/store/hooks";
import { Categories } from "features/transactions/Transactions.types";
import { TChartTiming } from "features/analytics/Analytics.types";

const chartOptions: { value: TChartTiming; label: string }[] = [
  {
    value: "years",
    label: "years",
  },
  {
    value: "months",
    label: "monthsNoun",
  },
  {
    value: "weeks",
    label: "weeks",
  },
  {
    value: "days",
    label: "days",
  },
];

const Analytics: React.FC = () => {
  const transactions = useAppSelector(
    (state) => state.transactionsReducer.transactions
  );
  const items = useAppSelector((state) => state.transactionsReducer.items);
  const [chartTiming, setChartTiming] = useState<TChartTiming>(
    chartOptions[1].value
  );

  const filtersOptions = {
    incomes: items
      .filter((item) => item.type === Categories.income)
      .map((item) => ({ value: item.id, label: item.name, icon: item.icon })),
    wallets: items
      .filter((item) => item.type === Categories.wallet)
      .map((item) => ({ value: item.id, label: item.name, icon: item.icon })),
    expenses: items
      .filter((item) => item.type === Categories.expense)
      .map((item) => ({ value: item.id, label: item.name, icon: item.icon })),
  };
  const [filters, setFilters] =
    useState<Record<"wallets" | "incomes" | "expenses", number[]>>(undefined);
  const dynamics = useMemo(
    () => getDynamics(transactions, items, chartTiming, filters),
    [transactions, items, chartTiming, filters]
  );
  const start = useMemo(
    () =>
      moment(Math.min(...transactions.map((t) => new Date(t.date).getTime())))
        .startOf(chartTiming)
        .toDate(),
    [transactions]

  );
  return (
    <Charts
      data={dynamics}
      start={start}
      chartTiming={chartTiming}
      chartOptions={chartOptions}
      filtersOptions={filtersOptions}
      filters={filters}
      onChangeFilters={(values) => setFilters(values)}
      onChangeChartTiming={(value) => setChartTiming(value)}
    />
  );
};

export default Analytics;
