// In CreateNewsFormDetails.ts

import * as Yup from "yup";

interface IStoryCard {
  id: string;
  description: string;
  bannerImage: string;
}

interface ICreateNewsFormDetails {
  title: null;
  description: null;
  bannerImage: null;
  video: null;
  storyCards: IStoryCard[] | null;
}

export const createNewsFormInitValues: ICreateNewsFormDetails = {
  title: null,
  description: null,
  bannerImage: null,
  video: null,
  storyCards: []
};
