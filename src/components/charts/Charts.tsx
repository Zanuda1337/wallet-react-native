import React, { useMemo, useState } from "react";import { useFormatMoney, useStyles, useTheme } from "src/hooks";import { statisticsStyles } from "src/components/charts/style";import { FormattedMessage, useIntl } from "react-intl";import { useAppSelector } from "src/store/hooks";import {  IFilterOption,  TChartTiming,} from "features/analytics/Analytics.types";import {  Categories,  TItemCategories,} from "features/transactions/Transactions.types";import moment from "moment";import { getDateUnits, pureDate, weekOfMonth } from "src/utils";import { Dimensions, FlatList, ScrollView, Text, View } from "react-native";import Button from "src/components/button/Button";import IconButton from "src/components/iconButton/IconButton";import SvgSelector from "src/components/svgSelector/SvgSelector";import Chart from "src/components/chart/Chart";import {  calculateRange,  convertDynamicsToPieChart,} from "features/analytics/Analytics.utils";import WithGrid from "src/components/chart/histogram/withGrid/WithGrid";import Tabs from "src/components/tabs/Tabs";import PieChart from "src/components/pieChart/PieChart";import FiltersModal from "features/analytics/filtersModal/FiltersModal";import { TDynamic } from "src/types";import { TOption } from "src/components/select/Select.types";const renderDate = (date: Date, chartTiming) => {  let format = "MMM";  switch (chartTiming) {    case "years":      format = "YYYY";      break;    case "months":      format = "MMM";      if (date.getMonth() === 0) format = "YYYY";      break;    case "weeks":      format = "D";      if (weekOfMonth(date) === 1) format = "MMM";      break;    case "days":      format = "DD.MM";      if (date.getDate() === 1) format = "MMM";      break;    default:      break;  }  return moment(date).format(format);};const renderChartHeader = (from: Date, to: Date): string => {  const format = "D MMM YYYY";  const formattedFrom = moment(from).format(format);  if (isNaN(from.getTime())) return "";  const formattedTo = moment(    moment(pureDate(to)).isAfter(pureDate()) ? pureDate() : to  ).format(format);  if (pureDate(from).getTime() === pureDate(to).getTime()) return formattedFrom;  return `${formattedFrom} - ${formattedTo}`;};type TStatisticsProps = {  data: TDynamic[];  start: Date;  chartTiming: TChartTiming;  chartOptions: TOption[];  onChangeChartTiming: (value: TChartTiming) => void;  filtersOptions: Record<string, IFilterOption[]>;  filters: Record<"wallets" | "incomes" | "expenses", number[]>;  onChangeFilters: (    values: Record<"wallets" | "incomes" | "expenses", number[]>  ) => void;};const Charts: React.FC<TStatisticsProps> = ({  data,  start,  chartTiming,  chartOptions,  filters,  filtersOptions,  onChangeChartTiming,  onChangeFilters,}) => {  const theme = useTheme();  const style = useStyles(statisticsStyles);  const formatMoney = useFormatMoney();  const { formatMessage } = useIntl();  const items = useAppSelector((state) => state.transactionsReducer.items);  const [datesRange, setDatesRange] = useState<Date[]>([]);  const [isFiltersOpen, setIsFiltersOpen] = useState(false);  const [category, setCategory] = useState<TItemCategories>(Categories.expense);  const from = datesRange[0]    ? moment(datesRange[0]).startOf(getDateUnits(chartTiming)).toDate()    : start;  const to = datesRange[1]    ? moment(datesRange[1]).endOf(getDateUnits(chartTiming)).toDate()    : moment(new Date()).endOf(getDateUnits(chartTiming)).toDate();  const dynamicsByDate = useMemo(    () =>      data.filter(        (item) =>          item.date.getTime() >= from.getTime() &&          item.date.getTime() <= to.getTime()      ),    [data, from, to]  );  const income = dynamicsByDate    .map((value) =>      value.incomes        .map((income) => income.amount)        .reduce((acc, amount) => acc + amount, 0)    )    .reduce((acc, amount) => acc + amount, 0);  const expense = dynamicsByDate    .map((value) =>      value.expenses        .map((income) => income.amount)        .reduce((acc, amount) => acc + amount, 0)    )    .reduce((acc, amount) => acc + amount, 0);  const handleChangeCategory = (newCategory: TItemCategories) => {    setCategory(newCategory);  };  const balance =    income -    expense +    items      .filter((i) => i.type === "wallet" && filters?.wallets.includes(i.id))      .reduce((acc, { initialBalance }) => acc + initialBalance, 0);  const isFilterDirty =    Object.values(filtersOptions).flat().length !==    Object.values(filters || []).flat().length;  return (    <>      <ScrollView style={[theme.styles.container]}>        <View style={[style.header]}>          <Text style={[theme.styles.title, style.mainTitle]}>            {formatMoney(balance)}          </Text>          <View style={style.horizontal}>            <FlatList              contentContainerStyle={[                style.horizontal,                { alignItems: "center" },              ]}              data={chartOptions}              horizontal              renderItem={({ item: option }) => (                <View style={{ overflow: "hidden", borderRadius: 10 }}>                  <Button                    translate={false}                    onPress={() =>                      onChangeChartTiming(option.value as TChartTiming)                    }                    variant={option.value === chartTiming ? "filled" : "ghost"}                    key={option.value}                    text={formatMessage({ id: option.label })}                    styles={{ root: style.option, text: style.optionText }}                  />                </View>              )}            />            <IconButton              size={40}              variant="ghost"              styles={{                root: {                  opacity: isFilterDirty ? 1 : 0.33,                },              }}              onPress={() => setIsFiltersOpen(true)}              icon={                <SvgSelector                  size={30}                  fill={                    isFilterDirty                      ? theme.colors.primaryLight                      : theme.colors.foreground                  }                  id="filter"                />              }            />          </View>          <Text            style={{              color: theme.colors.paleText,              textAlign: "center",              fontSize: 12,            }}          >            {renderChartHeader(from, to)}          </Text>        </View>        {data.length ? (          <Chart            data={data              .map((value) => ({                id: value.id,                a: value.incomes.reduce((acc, { amount }) => acc + amount, 0),                b: value.expenses.reduce((acc, { amount }) => acc + amount, 0),                date: value.date,              }))}            renderLabel={(item) => renderDate(item.date, chartTiming)}            range={datesRange}            onChangeRange={(date) =>              setDatesRange(calculateRange(date, datesRange, chartTiming))            }          />        ) : (          <View style={{ display: "flex", flexDirection: "row" }}>            <WithGrid zoom={1} displayHeight={500} height={250}>              <View                style={{                  display: "flex",                  alignItems: "center",                  justifyContent: "center",                  marginBottom: 14,                  height: 250,                  width: Dimensions.get("screen").width - theme.styles.container.paddingHorizontal * 2,                }}              >                <Text style={theme.styles.value}>                  <FormattedMessage id={"NO_DATA"} />                </Text>              </View>            </WithGrid>          </View>        )}        <View style={{ marginTop: 20 }}>          <Tabs            value={category}            tabs={[              { value: "income", label: "incomes", color: theme.colors.blue },              {                value: "expense",                label: "expenses",                color: theme.colors.error,              },            ]}            onChange={(value) => handleChangeCategory(value as TItemCategories)}          />        </View>        <PieChart data={convertDynamicsToPieChart(dynamicsByDate, category)} />        <View style={{ marginBottom: 120 }} />      </ScrollView>      <FiltersModal        visible={isFiltersOpen}        filtersOptions={filtersOptions}        onClose={() => setIsFiltersOpen(false)}        onChange={onChangeFilters}      />    </>  );};export default Charts;