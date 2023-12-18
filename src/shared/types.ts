import { z } from "zod";
export interface StandingsRoot {
  data:   Data;
  status: boolean;
 }
 
 export interface Data {
  abbreviation:  string;
  name:          string;
  season:        number;
  seasonDisplay: string;
  standings:     Standing[];
 }
 
 export interface 
 
 
 Standing {
  note?: Note;
  stats: Stat[];
  team:  Team;
 }
 
 export interface Note {
  color:       string;
  description: string;
  rank:        number;
 }
 
 export interface Stat {
  abbreviation:     Abbreviation;
  description:      Description;
  displayName:      Description;
  displayValue:     string;
  id?:              string;
  name:             Name;
  shortDisplayName: ShortDisplayName;
  summary?:         string;
  type:             Type;
  value?:           number;
 }
 
 export enum Abbreviation {
  A = "A",
  D = "D",
  F = "F",
  Gd = "GD",
  Gp = "GP",
  L = "L",
  P = "P",
  PD = "PD",
  Ppg = "PPG",
  R = "R",
  RC = "RC",
  Total = "Total",
  W = "W",
 }
 
 export enum Description {
  Draws = "Draws",
  GamesPlayed = "Games Played",
  GoalDifference = "Goal Difference",
  GoalsAgainst = "Goals Against",
  GoalsFor = "Goals For",
  Losses = "Losses",
  Overall = "Overall",
  OverallRecord = "Overall Record",
  PointDeductions = "Point Deductions",
  Points = "Points",
  PointsPerGame = "Points Per Game",
  Rank = "Rank",
  RankChange = "Rank Change",
  WINS = "Wins",
 }
 
 export enum Name {
  Deductions = "deductions",
  GamesPlayed = "gamesPlayed",
  Losses = "losses",
  Overall = "overall",
  PointDifferential = "pointDifferential",
  Points = "points",
  PointsAgainst = "pointsAgainst",
  PointsFor = "pointsFor",
  Ppg = "ppg",
  Rank = "rank",
  RankChange = "rankChange",
  Ties = "ties",
  WINS = "wins",
 }
 
 export enum ShortDisplayName {
  A = "A",
  D = "D",
  Deductions = "Deductions",
  F = "F",
  Gd = "GD",
  Gp = "GP",
  L = "L",
  Over = "OVER",
  P = "P",
  Ppg = "PPG",
  Rank = "Rank",
  RankChange = "Rank Change",
  W = "W",
 }
 
 export enum Type {
  Deductions = "deductions",
  Gamesplayed = "gamesplayed",
  Losses = "losses",
  Pointdifferential = "pointdifferential",
  Points = "points",
  Pointsagainst = "pointsagainst",
  Pointsfor = "pointsfor",
  Ppg = "ppg",
  Rank = "rank",
  Rankchange = "rankchange",
  Ties = "ties",
  Total = "total",
  WINS = "wins",
 }
 
 export interface Team {
  abbreviation:     string;
  displayName:      string;
  id:               string;
  isActive:         boolean;
  isNational:       boolean;
  location:         string;
  logos:            Logo[];
  name:             string;
  shortDisplayName: string;
  uid:              string;
 }
 
 export interface Logo {
  alt:         string;
  height:      number;
  href:        string;
  lastUpdated: LastUpdated;
  rel:         Rel[];
  width:       number;
 }
 
 export enum LastUpdated {
  The20190508T1607Z = "2019-05-08T16:07Z",
 }
 
 export enum Rel {
  Default = "default",
  Full = "full",
 }
 

const standingColumn = [
  {
      "accessorKey": "position",
      "header": "Position"
  },
  {
      "accessorKey": "club",
      "header": "Club"
  },
  {
      "accessorKey": "gamesPlayed",
      "header": "Games Played"
  },
  {
      "accessorKey": "losses",
      "header": "Losses"
  },
  {
      "accessorKey": "pointDifferential",
      "header": "Goal Difference"
  },
  {
      "accessorKey": "points",
      "header": "Points"
  },
  {
      "accessorKey": "pointsAgainst",
      "header": "Goals Against"
  },
  {
      "accessorKey": "pointsFor",
      "header": "Goals For"
  },
  {
      "accessorKey": "ties",
      "header": "Draws"
  },
  {
      "accessorKey": "wins",
      "header": "Wins"
  },
  {
      "accessorKey": "deductions",
      "header": "Point Deductions"
  },
  {
      "accessorKey": "ppg",
      "header": "Points Per Game"
  },
  {
      "accessorKey": "rank",
      "header": "Rank"
  },
  {
      "accessorKey": "rankChange",
      "header": "Rank Change"
  },
  {
      "accessorKey": "overall",
      "header": "Overall"
  }
]

const StandingColumnSchema = z.array(
  z.object({
    accessorKey: z.string(),
    header: z.string(),
  })
);

export type StandingColumn = typeof standingColumn
 