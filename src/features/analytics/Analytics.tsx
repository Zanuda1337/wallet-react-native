import React, { useMemo, useState } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import { useFormatMoney, useStyles, useTheme } from "src/hooks";
import Chart from "src/components/chart/Chart";
import { useAppSelector } from "src/store/hooks";
import { analyticsStyles } from "features/analytics/style";
import Button from "src/components/button/Button";
import { getDateUnits, getDynamics, pureDate, weekOfMonth } from "src/utils";
import moment from "moment";
import { TChartTiming } from "features/analytics/Analytics.types";
import {
  calculateRange,
  convertDynamicsToPieChart,
} from "features/analytics/Analytics.utils";
import { useIntl } from "react-intl";
import PieChart from "src/components/pieChart/PieChart";
import {
  Categories,
  TItemCategories,
} from "features/transactions/Transactions.types";
import Tabs from "src/components/tabs/Tabs";
import IconButton from "src/components/iconButton/IconButton";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import FiltersModal from "./filtersModal/FiltersModal";

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

const renderDate = (date: Date, chartTiming) => {
  let format = "MMM";
  switch (chartTiming) {
    case "years":
      format = "YYYY";
      break;
    case "months":
      format = "MMM";
      if (date.getMonth() === 0) format = "YYYY";
      break;
    case "weeks":
      format = "D";
      if (weekOfMonth(date) === 1) format = "MMM";
      break;
    case "days":
      format = "DD.MM";
      if (date.getDate() === 1) format = "MMM";
      break;
    default:
      break;
  }
  return moment(date).format(format);
};

const renderChartHeader = (from: Date, to: Date): string => {
  const format = "D MMM YYYY";
  const formattedFrom = moment(from).format(format);
  const formattedTo = moment(
    moment(pureDate(to)).isAfter(pureDate()) ? pureDate() : to
  ).format(format);
  if (pureDate(from).getTime() === pureDate(to).getTime()) return formattedFrom;
  return `${formattedFrom} - ${formattedTo}`;
};

const Analytics: React.FC = () => {
  const theme = useTheme();
  const style = useStyles(analyticsStyles);
  const formatMoney = useFormatMoney();
  const { formatMessage } = useIntl();
  const items = useAppSelector((state) => state.transactionsReducer.items);
  const transactions = useAppSelector(
    (state) => state.transactionsReducer.transactions
  );
  const [chartTiming, setChartTiming] = useState<TChartTiming>(
    chartOptions[1].value
  );
  const [datesRange, setDatesRange] = useState<Date[]>([]);
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
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const start = useMemo(
    () =>
      moment(Math.min(...transactions.map((t) => new Date(t.date).getTime())))
        .startOf(chartTiming)
        .toDate(),
    [transactions]
  );
  const [category, setCategory] = useState<TItemCategories>(Categories.expense);
  const from = datesRange[0]
    ? moment(datesRange[0]).startOf(getDateUnits(chartTiming)).toDate()
    : start;
  const to = datesRange[1]
    ? moment(datesRange[1]).endOf(getDateUnits(chartTiming)).toDate()
    : moment(new Date()).endOf(getDateUnits(chartTiming)).toDate();

  const dynamics = useMemo(
    () => getDynamics(transactions, items, chartTiming, filters),
    [transactions, items, chartTiming, filters]
  );
  const dynamicsByDate = useMemo(
    () =>
      dynamics.filter(
        (item) =>
          item.date.getTime() >= from.getTime() &&
          item.date.getTime() <= to.getTime()
      ),
    [dynamics, from, to]
  );

  const income = dynamicsByDate
    .map((value) =>
      value.incomes
        .map((income) => income.amount)
        .reduce((acc, amount) => acc + amount, 0)
    )
    .reduce((acc, amount) => acc + amount, 0);
  const expense = dynamicsByDate
    .map((value) =>
      value.expenses
        .map((income) => income.amount)
        .reduce((acc, amount) => acc + amount, 0)
    )
    .reduce((acc, amount) => acc + amount, 0);

  const handleChangeCategory = (newCategory: TItemCategories) => {
    setCategory(newCategory);
  };

  const balance =
    income -
    expense +
    items
      .filter((i) => i.type === "wallet" && filters?.wallets.includes(i.id))
      .reduce((acc, { initialBalance }) => acc + initialBalance, 0);

  const isFilterDirty =
    Object.values(filtersOptions).flat().length !==
    Object.values(filters || []).flat().length;

  return (
    <>
      <ScrollView style={[theme.styles.container]}>
        <View style={[style.header]}>
          <Text style={[theme.styles.title, style.mainTitle]}>
            {formatMoney(balance)}
          </Text>
          <View style={style.horizontal}>
            <FlatList
              contentContainerStyle={[
                style.horizontal,
                { alignItems: "center" },
              ]}
              data={chartOptions}
              horizontal
              renderItem={({ item: option }) => (
                <View style={{ overflow: "hidden", borderRadius: 10 }}>
                  <Button
                    translate={false}
                    onPress={() => setChartTiming(option.value)}
                    variant={option.value === chartTiming ? "filled" : "ghost"}
                    key={option.value}
                    text={formatMessage({ id: option.label })}
                    styles={{ root: style.option, text: style.optionText }}
                  />
                </View>
              )}
            />
            <IconButton
              size={40}
              variant="ghost"
              styles={{
                root: {
                  opacity: isFilterDirty ? 1 : 0.33,
                },
              }}
              onPress={() => setIsFiltersOpen(true)}
              icon={
                <SvgSelector
                  size={30}
                  fill={
                    isFilterDirty
                      ? theme.colors.primaryLight
                      : theme.colors.foreground
                  }
                  id="filter"
                />
              }
            />
          </View>
          <Text
            style={{
              color: theme.colors.paleText,
              textAlign: "center",
              fontSize: 12,
            }}
          >
            {renderChartHeader(from, to)}
          </Text>
        </View>
        <Chart
          data={dynamics
            .filter((item, index) => index > dynamics.length - 60)
            .map((value) => ({
              id: value.id,
              a: value.incomes
                .map((income) => income.amount)
                .reduce((acc, amount) => acc + amount, 0),
              b: value.expenses
                .map((expense) => expense.amount)
                .reduce((acc, amount) => acc + amount, 0),
              date: value.date,
            }))}
          renderLabel={(item) => renderDate(item.date, chartTiming)}
          range={datesRange}
          onChangeRange={(date) =>
            setDatesRange(calculateRange(date, datesRange, chartTiming))
          }
        />

        <Tabs
          value={category}
          tabs={[
            { value: "income", label: "incomes", color: theme.colors.blue },
            { value: "expense", label: "expenses", color: theme.colors.error },
          ]}
          onChange={(value) => handleChangeCategory(value as TItemCategories)}
        />
        <PieChart data={convertDynamicsToPieChart(dynamicsByDate, category)} />
        <View style={{ marginBottom: 120 }} />
      </ScrollView>
      <FiltersModal
        visible={isFiltersOpen}
        filtersOptions={filtersOptions}
        onClose={() => setIsFiltersOpen(false)}
        onChange={(values) => setFilters(values)}
      />
    </>
  );
};

export default Analytics;
