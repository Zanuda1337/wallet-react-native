import { StyleSheet } from "react-native";import moment from "moment";import { TItem, TTransaction } from "features/transactions/Transactions.types";import { getDenomination } from "features/transactions/Tansactions.utils";interface ObjectWithId {  id: number;}export const uniqueId = (array: ObjectWithId[]): number => {  if (!array?.length) return 0;  return array?.at(-1).id + 1;};export const toNormalCase = (text: string): string => {  return text    .split("")    .map((char) => {      if (/_/.test(char)) return " ";      if (/[A-Z]/.test(char)) return " " + char;      return char;    })    .join("");};export const capitalize = (text: string, onlyFirst: boolean = true): string =>  onlyFirst    ? text[0].toUpperCase() + text.slice(1)    : text        .split(" ")        .map((subtext) => subtext[0].toUpperCase() + subtext.slice(1))        .join(" ");export const createArray = (length: number, from: number = 0, step = 1): number[] => {  const array = [];  for (let i = 0; i < length; i++) {    array[i] = step * i + from;  }  return array;};export const daysPast = (from: Date, to: Date): number =>  (from.getTime() - to.getTime()) / 1000 / 60 / 60 / 24;export const formatMoney = (value: number): string => {  const chars = `${value}`.split("").reverse();  for (let i = 0; i < chars.length; i += 3) {    chars[i] = chars[i] + " ";  }  chars.reverse();  return chars.join("").trim();};export const createStyles = (callback) => (theme) =>  StyleSheet.create(callback(theme));export const arrayOfUniques = (array) => {  let uniqueArray = [];  array.forEach(    (item) => !uniqueArray.includes(item) && uniqueArray.push(item)  );  return uniqueArray;};export const pureDate = (date: Date = new Date()): Date => {  return moment({    date: date.getDate(),    month: date.getMonth(),    year: date.getFullYear(),  }).toDate();};export const clamp = (number: number, min: number, max: number) =>  Math.max(Math.min(number, max), min);export const getDynamics = (  transactions: TTransaction[],  items: TItem[],  by: "years" | "months" | "weeks"): {date: Date, expenses: number, incomes: number}[] => {  const trans = transactions.map((t) => {    const { fromItemId, toItemId, ...newTransaction } = t;    return {      ...newTransaction,      fromItem: items.find((i) => i.id === fromItemId),      toItem: items.find((i) => i.id === toItemId),    };  });  const start = new Date(    Math.min(...transactions.map((t) => new Date(t.date).getTime()))  );  const dynamics = [];  const datesRange = [];  for (let i = 0; true; i++) {    const nextDate = moment(start).add(i, 'month').startOf('month');    datesRange[0] = nextDate    datesRange[1] = moment(nextDate).endOf('month');    if(datesRange[0].isAfter(pureDate())) break;    const transByDate = trans.filter((t) => {      const d = moment(new Date(t.date));      return d.isSameOrAfter(datesRange[0]) && d.isBefore(datesRange[1]);    });    const expenses = transByDate      .map((t) =>        getDenomination(t.fromItem.type, t.toItem.type) === -1 ? t.amount : 0      )      .reduce((acc, val) => acc + val, 0);    const incomes = transByDate      .map((t) =>        getDenomination(t.fromItem.type, t.toItem.type) === 1 ? t.amount : 0      )      .reduce((acc, val) => acc + val, 0);    dynamics.push({      date: datesRange[0].toDate(),      expenses,      incomes,    })  }  return dynamics};