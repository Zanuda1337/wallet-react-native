import React, { memo } from "react";
import { Text, View } from "react-native";
import Button from "src/components/button/Button";
import moment from "moment";
import IconButton from "src/components/iconButton/IconButton";
import { TCalendarItem } from "src/components/datesRangePicker/DatesRangePicker";
import { useStyles, useTheme } from "src/hooks";
import { datesRangePickerStyles } from "src/components/datesRangePicker/style";
import { TDatesRange } from "src/components/datesRangePicker/DatesRangePicker.types";
import {pureDate} from "src/utils";

type TYearProps = {
  month: TCalendarItem;
  datesRange: TDatesRange;
  itemWidth: number;
  onSelectMonth: (date: Date) => void;
  onChangeRange: (date: Date) => void;
  isLast: boolean;
};

const Month: React.FC<TYearProps> = ({
  month,
  onSelectMonth,
  onChangeRange,
  datesRange,
  itemWidth,
  isLast
}) => {
  const theme = useTheme();
  const style = useStyles(datesRangePickerStyles);
  return (
    <>
      <View>
        <Button
          styles={{
            root: {
              justifyContent: "flex-start",
              paddingVertical: 5,
              marginVertical: 10,
            },
          }}
          variant="ghost"
          onPress={() => onSelectMonth(month.date)}
        >
          <Text style={[style.text, style.title]}>
            {month.momentDate.format("MMM YYYY")}
          </Text>
        </Button>
        <View style={style.days}>
          {month.days.map((day, index) => {
            const isLeft = moment(datesRange[0]).isSame(day.date);
            const isRight = moment(datesRange[1]).isSame(day.date);
            const inRange =
              moment(datesRange[0]).isSameOrBefore(day.date) &&
              datesRange[1] &&
              moment(datesRange[1]).isSameOrAfter(day.date);
            return (
              <View
                key={index}
                style={[
                  style.day,
                  inRange && day.value > 0 && style.dayInRangeContainer, // День будет с серым фоном, если он входит в диапазон дат
                  isLeft && style.leftDayContainer, // Сглаживаем левые края, если это крайний левый день в диапазоне
                  isRight && style.rightDayContainer, // Сглаживаем правые края, если крайний правый
                  (day.isStartOfWeek || day.value === 1) &&
                    style.leftDayContainer, // Сглаживаем слева, если ПН или если первый день месяца
                  (day.isEndOfWeek || day.value === month.lastDay) &&
                    style.rightDayContainer, // Сглаживаем справа, если ВС или если последний день в месяце
                ]}
              >
                <IconButton
                  disabled={day.value < 1 || day.isFuture}
                  styles={{
                    root: {
                      opacity: day.value < 1 ? 0 : day.isFuture ? 0.25 : 1,
                    },
                  }}
                  variant={isLeft || isRight ? "filled" : day.momentDate.isSame(pureDate()) ? 'outlined' : 'ghost'}
                  size={itemWidth}
                  icon={<Text style={[style.text, {color: isRight || isLeft ? theme.colors.independentForeground : style.text.color}]}>{day.value}</Text>}
                  onPress={() => onChangeRange(day.date)}
                />
              </View>
            );
          })}
        </View>
        {isLast && <View style={{marginBottom: 50}}/>}
      </View>
    </>
  );
};

export default memo(Month);
