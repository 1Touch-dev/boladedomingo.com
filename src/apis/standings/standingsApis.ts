import httpService from "@/services/httpService";
import type { IStandingResponse } from "./standings.type";

const standingsApis = {
  getAll: () => {
    return httpService.get<IStandingResponse[]>("/standings");
  },
};

export default standingsApis;
