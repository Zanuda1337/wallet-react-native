export type TPieChartItem = {  label: string;  value: number;};export interface IPieChartPortion extends TPieChartItem {  portion: number;  color: string;}