import React from "react";import { FlatList, View, Text } from "react-native";import { useStyles, useTheme } from "src/hooks";import { histogramStyles } from "src/components/histogram/style";import { createArray, formatMoney } from "src/utils";import WithGrid from "src/components/histogram/withGrid/WithGrid";import Bar from "src/components/histogram/bar/Bar";type THistogramProps = {  height?: number;  data: {    a: number;    b: number;    label: string;  }[];};const Histogram: React.FC<THistogramProps> = ({ data, height = 220 }) => {  const style = useStyles(histogramStyles);  const maxA = Math.max(...data.map((item) => item.a));  const maxB = Math.max(...data.map((item) => item.b));  const max = Math.max(maxA, maxB);  const zoom = 1;  const modifier = +"1".padEnd(max.toString().length, "0");  const displayHeight = Math.ceil(max / modifier) * modifier;  return (    <View style={style.container}>      <WithGrid zoom={zoom} displayHeight={displayHeight} height={height}>        <FlatList          data={data}          contentContainerStyle={[style.scrollContainer]}          horizontal          inverted          keyExtractor={(item, index) => index.toString()}          renderItem={({ item }) => (            <Bar              a={item.a}              b={item.b}              label={item.label}              height={height}              zoom={zoom}              displayHeight={displayHeight}            />          )}        />      </WithGrid>    </View>  );};export default Histogram;