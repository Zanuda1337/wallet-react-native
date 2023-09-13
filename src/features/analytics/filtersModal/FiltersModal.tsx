import React, {useCallback, useEffect, useMemo, useState} from "react";
import SvgSelector from "src/components/svgSelector/SvgSelector";
import { useStyles, useTheme } from "src/hooks";
import { statisticsStyles } from "src/components/charts/style";
import Dialogue from "src/components/dialogue/Dialogue";
import Header from "src/components/header/Header";
import {FormattedMessage, useIntl} from "react-intl";
import {View, Text, FlatList, Dimensions} from "react-native";
import Button from "src/components/button/Button";
import { getItemColors } from "features/transactions/Tansactions.utils";
import Checkbox from "src/components/checkbox/Checkbox";
import {IFilterOption} from "features/analytics/Analytics.types";
import {capitalize} from "src/utils";

type TFilterListProps = {
  visible: boolean;
  filtersOptions: Record<string, IFilterOption[]>;
  onClose: () => void;
  onChange: (filters: Record<string, number[]>) => void
};

const FiltersModal: React.FC<TFilterListProps> = ({
  onClose,
  visible,
  filtersOptions,
  onChange
}) => {
  const theme = useTheme();
  const style = useStyles(statisticsStyles);
  const {formatMessage} = useIntl();
  const initialFilters = useMemo(() => ({
    incomes: filtersOptions.incomes.map((option) => option.value),
    wallets: filtersOptions.wallets.map((option) => option.value),
    expenses: filtersOptions.expenses.map((option) => option.value),
  }), [filtersOptions]);
  const [filters, setFilters] = useState(initialFilters);
  const itemColors = getItemColors(theme);
  const handleChange = useCallback((category: string, value: number) => {
    const items = filters[category].includes(value)
      ? filters[category].filter((i) => i !== value)
      : [...filters[category], value];
    setFilters({ ...filters, [category]: items });
  }, [filters]);
  const handleCheckbox = useCallback((category: string) => {
    if(getIndeterminate(category) || !getChecked(category)) {
      setFilters({
        ...filters,
        [category]: initialFilters[category]
      })
      return
    }
      setFilters({...filters, [category]: []})
  }, [filters, initialFilters])
  useEffect(() => {
    onChange(filters);
  }, [filters])
  const getChecked = useCallback((category) => {
    return filters[category]?.length === initialFilters[category]?.length
  }, [filters, initialFilters])
  const getIndeterminate = useCallback((category) => {
    return filters[category]?.length > 0 && filters[category]?.length !== initialFilters[category]?.length
  }, [filters, initialFilters])
  return (
    <>
      <Dialogue
        visible={visible}
        styles={{ root: { padding: 0, maxHeight: Dimensions.get('screen').height * 0.66, overflow: "hidden", flexGrow:1, paddingBottom: 80 } }}
        header={
          <Header
            styles={{
              root: {
                paddingHorizontal: 0,
                paddingVertical: 0,
                marginTop: 18,
                marginHorizontal: 18,
              },
            }}
            label={capitalize(formatMessage({id: 'filters'}))}
            leftButtonProps={{visible: false}}
            rightButtonProps={{
              onPress: onClose,
              icon: (
                <SvgSelector
                  id="multiply"
                  stroke={theme.colors.foreground}
                  size={20}
                />
              ),
              size: 42,
            }}
          />
        }
        cancelButtonProps={{ visible: false }}
        submitButtonProps={{ visible: false }}
        onBackdropPress={onClose}
      >
        <View style={{flexGrow: 1, overflow: "hidden"}}><FlatList
          data={Object.entries(filtersOptions)}
          keyExtractor={([label]) => label}
          renderItem={({item: [label, options]}) =>
            (
              <View>
                <View style={style.filterTitleContainer}>
                  <Checkbox checked={getChecked(label)}
                            indeterminate={getIndeterminate(label)}
                            onChange={() => handleCheckbox(label)}/>
                  <Text style={style.filterTitle}><FormattedMessage id={label}/></Text>
                </View>
                <View style={style.buttons}>
                  {options.map((option) => {
                    const color = filters[label].includes(option.value) ? theme.colors.independentForeground : theme.colors.foreground
                    return (
                      <View
                        key={option.value}
                        style={{borderRadius: 10, overflow: "hidden"}}
                      >
                        <Button
                          variant={
                            filters[label].includes(option.value)
                              ? "filled"
                              : "outlined"
                          }
                          color={itemColors[label.slice(0, label.length - 1)]}
                          styles={{
                            root: {
                              ...style.button,
                              borderWidth: 1.5,
                              borderColor: filters[label].includes(option.value) ? theme.colors.independentForeground : theme.colors.pale
                            },
                          }}
                          onPress={() => handleChange(label, option.value)}
                        >
                          <View style={style.buttonContent}>
                            <SvgSelector
                              id={option.icon}
                              size={20}
                              fill={color}
                              stroke={color}
                            />
                            <Text
                              style={[style.buttonLabel, {color}]}>{option.label}</Text>
                          </View>
                        </Button>
                      </View>
                    )
                  })}
                </View>
              </View>
            )
          }
        /></View>
      </Dialogue>
    </>
  );
};

export default FiltersModal;
