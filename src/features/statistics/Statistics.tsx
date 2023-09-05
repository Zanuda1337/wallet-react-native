import React, { useCallback, useMemo, useState } from "react";
import { capitalize, getDynamics } from "src/utils";
import { useAppSelector } from "src/store/hooks";
import {
  TItem,
  TItemCategories,
} from "features/transactions/Transactions.types";
import Tabs from "src/components/tabs/Tabs";
import { getAverageCashFlow } from "src/components/charts/Charts.utils";
import { useFormatMoney, useStyles, useTheme } from "src/hooks";
import { View, Text, FlatList } from "react-native";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import { statisticsStyles } from "features/statistics/style";
import { useIntl } from "react-intl";
import Select from "src/components/select/Select";
import { TChartTiming } from "features/analytics/Analytics.types";

const options: { value: TChartTiming; label: string }[] = [
  {
    value: "years",
    label: "PER_YEAR",
  },
  {
    value: "months",
    label: "PER_MONTH",
  },
  {
    value: "weeks",
    label: "PER_WEEK",
  },
  {
    value: "days",
    label: "PER_DAY",
  },
];

const Statistics: React.FC = () => {
  const transactions = useAppSelector(
    (state) => state.transactionsReducer.transactions
  );
  const items: TItem[] = useAppSelector(
    (state) => state.transactionsReducer.items
  );
  const style = useStyles(statisticsStyles);
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const [category, setCategory] = useState<TItemCategories>("expense");
  const handleChangeCategory = useCallback((value) => setCategory(value), []);
  const [period, setPeriod] = useState<TChartTiming>(options[1].value);

  const formatMoney = useFormatMoney();

  const dynamics = useMemo(
    () => getDynamics(transactions, items, period),
    [transactions, items, period]
  );

  const cashFlow = getAverageCashFlow(dynamics, items);
  return (
    <>
      <View style={theme.styles.container}>
        <Select
          styles={{ optionText: { textTransform: "none" } }}
          renderValue={(value) => capitalize(formatMessage({ id: value }))}
          label={"period"}
          options={options}
          value={period}
          onChange={(value) => setPeriod(value as TChartTiming)}
        />
      </View>
      <View style={theme.styles.container}>
        <Tabs
          value={category}
          tabs={[
            { value: "income", label: "incomes", color: theme.colors.blue },
            { value: "expense", label: "expenses", color: theme.colors.error },
          ]}
          onChange={(value) => handleChangeCategory(value as TItemCategories)}
        />
      </View>
      <View style={[{ flex: 1, gap: 0 }]}>
        <View
          style={[
            style.tableRow,
            style.tableHeader,
            { paddingHorizontal: theme.styles.container.paddingHorizontal },
          ]}
        >
          <View style={[style.cell, { flex: 2 }]}>
            <Text style={style.tableText}>
              {capitalize(formatMessage({ id: "category" }))}
            </Text>
          </View>
          <View style={[style.cell]}>
            <Text style={[style.tableText]}>
              {capitalize(formatMessage({ id: "average" }))}
            </Text>
          </View>
          <View style={[style.cell, { justifyContent: "flex-end" }]}>
            <Text style={style.tableText}>
              {capitalize(formatMessage({ id: "median" }))}
            </Text>
          </View>
        </View>
        {!cashFlow[category].length && <View
          style={[
            style.tableRow,
            {
              paddingVertical: 10,
              paddingHorizontal: theme.styles.container.paddingHorizontal,
            },
          ]}
        >
          <View style={[style.cell, { flex: 2 }]}>
            <Text style={style.tableText}>-</Text>
          </View>
          <View style={style.cell}>
            <Text style={[style.tableText, { fontSize: 11 }]}>-</Text>
          </View>
          <View style={[style.cell, { justifyContent: "flex-end" }]}>
            <Text style={[style.tableText, { fontSize: 11 }]}>-</Text>
          </View>
        </View>}
        <FlatList
          data={cashFlow[category]}
          keyExtractor={(item) => item.category}
          renderItem={({ item, index }) => {
            const currItem = items.find((i) => item.category === i.name);
            if (!currItem) return <></>;
            return (
              <View
                key={item.category}
                style={[
                  style.tableRow,
                  {
                    backgroundColor:
                      index % 2 !== 0
                        ? `${theme.colors.foreground}10`
                        : undefined,
                    paddingHorizontal: theme.styles.container.paddingHorizontal,
                  },
                ]}
              >
                <View style={[style.cell, { flex: 2 }]}>
                  <View
                    style={[
                      theme.styles.circle,
                      {
                        backgroundColor:
                          category === "income"
                            ? theme.colors.blue
                            : theme.colors.error,
                        width: 30,
                        height: 30,
                      },
                    ]}
                  >
                    <SvgSelector
                      id={currItem.icon}
                      size={18}
                      fill={"white"}
                      stroke={"white"}
                    />
                  </View>
                  <Text style={style.tableText}>{item.category}</Text>
                </View>
                <View style={style.cell}>
                  <Text style={[style.tableText, { fontSize: 11 }]}>
                    {formatMoney(item.average)}
                  </Text>
                </View>
                <View style={[style.cell, { justifyContent: "flex-end" }]}>
                  <Text style={[style.tableText, { fontSize: 11 }]}>
                    {formatMoney(item.median)}
                  </Text>
                </View>
              </View>
            );
          }}
        />
        {[...cashFlow.income, ...cashFlow.expense].length ? (
          <>
            <View
              style={[
                style.tableRow,
                {
                  paddingVertical: 10,
                  paddingHorizontal: theme.styles.container.paddingHorizontal,
                },
              ]}
            >
              <View style={[style.cell, { flex: 2 }]}>
                <Text style={style.tableText}>{capitalize(formatMessage({id: 'total', } ))}</Text>
              </View>
              <View style={style.cell}>
                <Text style={[style.tableText, { fontSize: 11 }]}>
                  {formatMoney(
                    cashFlow[category].reduce(
                      (acc, { average }) => acc + average,
                      0
                    )
                  )}
                </Text>
              </View>
              <View style={[style.cell, { justifyContent: "flex-end" }]}>
                <Text style={[style.tableText, { fontSize: 11 }]}>
                  {formatMoney(
                    cashFlow[category].reduce(
                      (acc, { median }) => acc + median,
                      0
                    )
                  )}
                </Text>
              </View>
            </View>
            <View
              style={[
                style.tableRow,
                {
                  paddingVertical: 10,
                  paddingHorizontal: theme.styles.container.paddingHorizontal,
                },
              ]}
            >
              <View style={[style.cell, { flex: 2 }]}>
                <Text style={style.tableText}>{capitalize(formatMessage({id: 'profit'}))}</Text>
              </View>
              <View style={style.cell}>
                <Text style={[style.tableText, { fontSize: 11 }]}>
                  {formatMoney(
                    cashFlow["income"].reduce(
                      (acc, { average }) => acc + average,
                      0
                    ) -
                      cashFlow["expense"].reduce(
                        (acc, { average }) => acc + average,
                        0
                      )
                  )}
                </Text>
              </View>
              <View style={[style.cell, { justifyContent: "flex-end" }]}>
                <Text style={[style.tableText, { fontSize: 11 }]}>
                  {formatMoney(
                    cashFlow["income"].reduce(
                      (acc, { median }) => acc + median,
                      0
                    ) -
                      cashFlow["expense"].reduce(
                        (acc, { median }) => acc + median,
                        0
                      )
                  )}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
      </View>
      <View style={{ marginBottom: 100 }} />
    </>
  );
};

export default Statistics;
