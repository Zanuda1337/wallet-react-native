import Transactions from "features/transactions/Transactions";import Feed from "features/feed/Feed";import Settings from "features/settings/Settings";export const routes = [  { label: "transactions", icon: 'home',  path: "/", component: Transactions, show: true },  { label: "feed", icon: 'statistics',  path: "/feed", component: Feed, show: true },  { label: "kek", icon: 'insertChart',  path: "/kek", component: Feed, show: true },  // { label: "mek", icon: 'wallet',  path: "/mek", component: Feed, show: true },  { label: "settings", icon: 'settings',  path: "/settings", component: Settings, show: true },];