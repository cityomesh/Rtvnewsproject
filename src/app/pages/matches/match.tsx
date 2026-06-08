import * as Yup from "yup";

export interface ITeam {
  teamId: string;
  teamName: string;
  teamLogo: string;
  teamState: string;
  teamThemeColor: string;
  _links: SelfLink | undefined | null;
}

export const initTeamVal: ITeam = {
  teamId: "",
  teamName: "",
  teamLogo: "",
  teamState: "",
  teamThemeColor: "",
  _links: null,
};

export interface teamEvent {
  type: string | null;
  event1: string | null;
  event2: string | null;

}

export const initTeamEvent: teamEvent = {
  type: "",
  event1: null,
  event2: null,

}


export interface teamStat {
  team1value: number | null;
  team2value: number | null;
  type: string | null;
}

export const initTeamStat: teamStat =  {
  team1value: null,
  team2value: null,
  type: ""
}


export interface teamScore {
  team1Score: number;
  team2Score: number;
 
}

export const initTeamScore: teamScore = {
  team1Score: 0,
  team2Score: 0
}


export interface IMatchEvents {
  matchEvents: teamEvent[] | null;
  stats: teamStat[]  | null;
  score: teamScore | null;
}

export const initMatchEventsValues: IMatchEvents  = {
  matchEvents: [],
  stats: [],
  score: null
}

export interface ITeamScoreBoard {
  totalScore: number;
}

export const initTeamScoreBoard: ITeamScoreBoard = {
  totalScore: 0,
};

export interface IMatch {
  venueState: string;
  team1: ITeam | null;
  team2: ITeam | null;
  matchDate: string;
  footballLeague: string;
  matchRound: string;
  matchResult: IMatchEvents | null;
  seasonDate: string
  team1ScoreBoard: ITeamScoreBoard | null;
  team2ScoreBoard: ITeamScoreBoard | null;
}

export const initMatchVal: IMatch = {
  venueState: "",
  team1: null,
  team2: null,
  matchDate: "",
  footballLeague: "",
  matchRound: "",
  seasonDate: "",
  matchResult: null,
  // {
  //   matchEvents: [{
  //     type: "",
  //     event1: "",
  //     event2: "", }],
  //   stats: [{
  //     team1value: 0,
  //     team2value: 0,
  //     type: ""
  //   }],
  //   score: {
  //     team1Score: 0,
  //     team2Score: 0
  //   }
  // },
  team1ScoreBoard: { totalScore: 0 },
  team2ScoreBoard: { totalScore: 0 }, // Initialize with a default score object
};




export const createMatchSchema = Yup.object().shape({
  venueState: Yup.string().required().label("Venue state"),
  team1: Yup.object().nonNullable().label("Team 1"),
  team2: Yup.object()
    .nonNullable()
    .label("Team 2")
    .test(
      "is-different-from-team1",
      "Team 2 cannot be the same as Team 1",
      function (value) {
        const team1 = this.parent.team1;
        return JSON.stringify(value) !== JSON.stringify(team1);
      }
    ),
  matchDate: Yup.date().required().label("Match date"),
  footballLeague: Yup.string().required().label("Football league"),
  matchRound: Yup.string().required().label("Match Round"),
  seasonDate:Yup.string().required().label("Season"),
  matchResult: Yup.object({
    matchEvents: Yup.array().of(
      Yup.object({
        event1: Yup.string().nullable(),
        event2: Yup.string().nullable(),
        type: Yup.string().nullable()
      })
    ).nullable(),
    stats: Yup.array().of(
      Yup.object({
        // team1value: Yup.number().min(0).required("Score is required").label("Team 1 Value"),
        // team2value: Yup.number().min(0).required("Score is required").label("Team 2 Value"),
        team1value: Yup.number().min(0).nullable().label("Team 1 Value"),
        team2value: Yup.number().min(0).nullable().label("Team 2 Value"),
        // type: Yup.string().nonNullable().required("Type is required")
        type: Yup.string().nullable()
      })
    ).nullable(),
      score: Yup.object({
        team1Score: Yup.number().min(0).label("Team 1 Score"),
        team2Score: Yup.number().min(0).label("Team 2 Score")
      })
  }).nullable(),
//   team1ScoreBoard: Yup.object({
//     totalScore: Yup.number().min(0)
// //       .required("Score is required").label("Team 1 Score")
//      ,
//   }),

//   team2ScoreBoard: Yup.object({
//     totalScore: Yup.number().min(0)
// //       .required("Score is required").label("Team 2 Score")
//      ,
//   }),
});
