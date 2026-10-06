import { MatchStatusEnum } from "@/types/enum";

export interface IMatchResponse {
  id: string;
  home: string;
  away: string;
  score?: string;
  status: MatchStatusEnum;
  kickoff: string;
  competition: string;
}

export interface IMatchesByDateParams {
  date: string;
}
