import httpService from "@/services/httpService";
import type { IMatchResponse } from "./matches.type";

const matchesApis = {
  getAll: () => {
    return httpService.get<IMatchResponse[]>("/matches");
  },
  getByDate: (date: string) => {
    return httpService.get<IMatchResponse[]>("/matches", { params: { date } });
  },
};

export default matchesApis;
