import * as Yup from "yup";

export interface ITeam {
  teamName: string;
  teamLogo: string;
  teamState: string;
  teamThemeColor: string;
  _links: SelfLink | undefined | null
}

export const initTeamVal: ITeam = {
  teamName: "",
  teamLogo: "",
  teamState: "",
  teamThemeColor: "",
  _links: null
};

export const creatTeamSchema = Yup.object().shape({
  teamName: Yup.string().required().max(30).label("Name"),
  teamLogo: Yup.string().url().required().label("Logo"),
  teamState: Yup.string().required().label("State"),
  teamThemeColor: Yup.string().required().label("Theme Color"),
});
