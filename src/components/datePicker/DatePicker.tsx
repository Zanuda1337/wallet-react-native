import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Dimensions,  FlatList } from "react-native";
import TextField from "src/components/textField/TextField";
import Dialogue from "src/components/dialogue/Dialogue";
import { datePickerStyles } from "./style";
import moment from "moment";
import { capitalize, createArray, daysPast } from "src/utils";
import IconButton, {
  IconButtonVariant,
} from "src/components/iconButton/IconButton";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import Button from "src/components/button/Button";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import { useStyles, useTheme } from "src/hooks";

const years = createArray(200, 1970);

const getDisplayedDate = (
  date: Date,
  passedDays: number,
  intl: IntlShape,
  format = "dd, MMM D"
): string => {
  if (passedDays === 0) return capitalize(intl.formatMessage({ id: "today" }));
  if (passedDays === 1)
    return capitalize(intl.formatMessage({ id: "yesterday" }));
  return moment(date).format(format);
};

type TDatePickerProps = {
  label: string;
  disableFuture?: boolean;
  value?: Date;
  onSubmit?: (date: Date) => void;
  dateFormat?: string;
};

const DatePicker: React.FC<TDatePickerProps> = ({
  value = moment({
    date: new Date().getDate(),
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  }).toDate(),
  label,
  disableFuture = false,
  onSubmit,
  dateFormat = "DD.MM.YYYY",
}) => {
  const style = useStyles(datePickerStyles);
  const theme = useTheme();
  const itemWidth =
    Dimensions.get("screen").width / 7 -
    style.horizontalList.gap / 7 -
    theme.styles.container.paddingHorizontal;
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState(value.getDate());
  const [month, setMonth] = useState(value.getMonth());
  const [year, setYear] = useState(value.getFullYear());
  const [showYears, setShowYears] = useState(false);

  const intl = useIntl();

  const [date, setDate] = useState(value);

  const viewDate = moment({ date: day, month, year });
  const today = moment({
    day: moment().date(),
    month: moment().month(),
    year: moment().year(),
  });

  const lastDayOfMonthDate = moment(viewDate).endOf("month");
  const firstWeekdayDate = moment(viewDate).startOf("month");
  const days = createArray(lastDayOfMonthDate.date(), 1);
  const empties = createArray(firstWeekdayDate.day() - 1);
  const allYears = useMemo(
    () => years.filter((year) => !disableFuture || year <= moment().year()),
    [disableFuture]
  );

  const handleSelectDay = (selectedDay: number) => {
    const newDate = moment({ date: selectedDay, month, year });
    setDate(newDate.toDate());
    setDay(selectedDay);
    handleSubmit(newDate.toDate());
  };

  const handleSelectMonth = (offset: number) => {
    const newMonth = month + offset;
    if (newMonth < 0 || newMonth > 11) {
      const newYear = year + offset;
      if (!allYears.includes(newYear)) return;
      setYear(newYear);
      setMonth(Math.abs(12 - Math.abs(newMonth)));
      return;
    }
    const currentDate = moment({ date: day, month: newMonth, year });
    if (disableFuture && currentDate.isAfter(today)) return;
    setMonth(newMonth);
  };

  const handleSelectYear = (yearNumber: number) => {
    const possibleDate = moment({
      month,
      year: yearNumber,
    });
    const lastDayInMonth = possibleDate.endOf("month").date();
    const newDay = day > lastDayInMonth ? lastDayInMonth : day;
    let newDate = moment({
      date: newDay,
      month: possibleDate.month(),
      year: possibleDate.year(),
    }).toDate();
    if (moment(newDate).isAfter(today)) {
      newDate = today.toDate();
      setMonth(newDate.getMonth());
    }
    setDate(newDate);
    setDay(newDay);
    setYear(yearNumber);
    setShowYears(false);
  };

  useEffect(() => {
    if (!visible) return;
    reset();
  }, [visible]);

  const reset = () => {
    const newDate = moment({
      date: value.getDate(),
      month: value.getMonth(),
      year: value.getFullYear(),
    }).toDate();
    setDay(newDate.getDate());
    setMonth(newDate.getMonth());
    setYear(newDate.getFullYear());
    setShowYears(false);
    setDate(newDate);
  };

  const handleClose = () => {
    setTimeout(() => {
      reset();
      setVisible(false);
    });
  };
  const handleSubmit = (submitDate: Date) => {
    onSubmit && onSubmit(submitDate);
    handleClose();
  };

  const daysMap = useMemo(
    () =>
      days.map((dayNumber, i) => {
        const currentDate = moment({ day: dayNumber, month, year });
        const isDisabled = disableFuture && currentDate.isAfter(today);

        const isCurrentDay = today.isSame(currentDate);
        const isSelectedDay = moment(date).isSame(currentDate);

        let variant: IconButtonVariant = isCurrentDay ? "outlined" : "ghost";
        if (isSelectedDay) variant = "filled";

        return (
          <IconButton
            key={i}
            disabled={isDisabled}
            styles={{ root: { opacity: isDisabled ? 0.25 : 1 } }}
            variant={variant}
            size={itemWidth}
            icon={
              <Text style={isSelectedDay ? style.lightText : style.text}>
                {dayNumber}
              </Text>
            }
            onPress={() => handleSelectDay(dayNumber)}
          />
        );
      }),
    [month, year, today, date]
  );

  return (
    <View>
      <TextField
        label={label}
        onPress={() => setVisible(true)}
        disabled={true}
        value={getDisplayedDate(
          value,
          daysPast(today.toDate(), value),
          intl,
          dateFormat
        )}
      />
      <Dialogue
        styles={{
          content: style.dialogueContainer,
          root: style.dialogueContainer,
          footer: style.container,
          container: { paddingVertical: 0, gap: 0 },
        }}
        header={
          <View style={[style.dialogueHeader, style.container]}>
            <Text style={[style.title, style.lightText]}>
              <FormattedMessage id="SELECT_DATE" />
            </Text>
            <Text style={[style.subtext, style.lightText]}>
              {getDisplayedDate(date, daysPast(today.toDate(), date), intl)}
            </Text>
          </View>
        }
        visible={visible}
        onBackdropPress={handleClose}
        submitButtonProps={{ text: "apply", onPress: () => handleSubmit(date) }}
        cancelButtonProps={{ onPress: handleClose }}
      >
        <View style={{ gap: 30, display: "flex" }}>
          <View
            style={[
              style.horizontalList,
              {
                justifyContent: "space-between",
                paddingHorizontal: 13,
                height: 40,
                flexWrap: "nowrap",
              },
            ]}
          >
            <View style={style.horizontalList}>
              <View
                onTouchStart={(e) => {
                  setShowYears(!showYears);
                }}
              >
                <Text style={style.text}>{viewDate.format("MMMM YYYY")}</Text>
              </View>
              <IconButton
                size={25}
                variant="ghost"
                icon={
                  <SvgSelector
                    id={showYears ? "upArrow" : "downArrow"}
                    fill={theme.colors.foreground}
                    size={10}
                  />
                }
                onPress={() => {
                  setShowYears(!showYears);
                }}
              />
            </View>
            {!showYears && (
              <View style={style.arrows}>
                <IconButton
                  variant="ghost"
                  size={35}
                  icon={
                    <SvgSelector
                      id="arrow"
                      fill={theme.colors.foreground}
                      size={12}
                    />
                  }
                  onPress={() => handleSelectMonth(-1)}
                />
                <IconButton
                  variant="ghost"
                  size={35}
                  icon={
                    <SvgSelector
                      id="rightArrow"
                      fill={theme.colors.foreground}
                      size={12}
                    />
                  }
                  onPress={() => handleSelectMonth(1)}
                />
              </View>
            )}
          </View>
          {!showYears ? (
            <>
              <View style={style.horizontalList}>
                {moment.weekdaysMin().map((day, i) => (
                  <Text
                    style={{
                      ...style.text,
                      width: itemWidth,
                      color: theme.colors.subtext,
                      textAlign: "center",
                      textTransform: "capitalize",
                    }}
                    key={i}
                  >
                    {day[0]}
                  </Text>
                ))}
              </View>
              <View style={style.horizontalList}>
                {empties.map((el, i) => (
                  <IconButton
                    key={i}
                    styles={{ root: { opacity: 0 } }}
                    disabled
                    size={itemWidth}
                  />
                ))}
                {daysMap}
              </View>
            </>
          ) : (
            <FlatList
              keyExtractor={(item) => item.toString()}
              contentContainerStyle={{
                display: "flex",
                gap: 5,
              }}
              data={allYears}
              style={{ maxHeight: 300 }}
              numColumns={4}
              renderItem={({ item: yearNumber, index: i }) => {
                const currentDate = moment({
                  date: day,
                  month,
                  year: yearNumber,
                });

                const isSelectedDay = moment(date).isSame(currentDate);
                return (
                  <Button
                    translate={false}
                    styles={{
                      root: {
                        borderRadius: 40,
                        padding: 6,
                        width:
                          Dimensions.get("screen").width / 4 -
                          style.horizontalList.gap / 4 -
                          theme.styles.container.paddingHorizontal -
                          3 -
                          7.5,
                      },
                      text: {
                        fontSize: 14,
                        fontFamily: "Inter-SemiBold",
                        color: isSelectedDay
                          ? theme.colors.independentForeground
                          : theme.colors.foreground,
                      },
                    }}
                    onPress={() => handleSelectYear(yearNumber)}
                    key={i}
                    variant={isSelectedDay ? "filled" : "ghost"}
                    text={yearNumber.toString()}
                  />
                );
              }}
            />
          )}
        </View>
      </Dialogue>
    </View>
  );
};

export default DatePicker;
