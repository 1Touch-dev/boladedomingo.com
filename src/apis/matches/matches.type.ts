export interface IFootballMatchTeam {
  id?: number;
  name?: string;
  logo?: string;
  score?: number | null;
}

export interface IFootballMatch {
  id?: number | string;
  date?: string;
  status?: string;
  matchday?: string;
  venue?: string;
  homeTeam?: IFootballMatchTeam;
  awayTeam?: IFootballMatchTeam;
}

export interface IFootballMatchesEnvelope {
  source?: string;
  response?: IFootballMatch[];
  results?: number;
}
