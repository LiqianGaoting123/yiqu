import { INITDATA, INFOUPDATE, SHOWLOADING, HOMEDATA, FOLLOW, AUTHENTICATION, NICKNAME } from "./types";
const initData = (data) => ({ type: INITDATA, data: data });
const infoUpdate = (data) => ({ type: INFOUPDATE, data: data });
const showLoading = (status) => ({ type: SHOWLOADING, status: status });
const homeData = (data) => ({ type: HOMEDATA, data: data });
const follow = (status) => ({ type: FOLLOW, status: status });
const authentication = (status) => ({ type: AUTHENTICATION, status: status });
const nicknames = (status) => ({ type: NICKNAME, status: status });
export { initData, infoUpdate, showLoading, homeData, follow, authentication }