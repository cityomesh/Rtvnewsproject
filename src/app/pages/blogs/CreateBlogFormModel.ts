import * as Yup from "yup";

export interface ICreateBlogFormDetails {
  title: string;
  description: string;
  bannerImage: string;
  sourceUrl: string;
  content: string;
}

export const createBlogFormInitValues: ICreateBlogFormDetails = {
  title: "",
  description: "",
  bannerImage: "",
  sourceUrl: "",
  content: ""
};

export const createBlogFormDetailsSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(30, "Title must be at most 30 characters"),
  description: Yup.string().required("Description is required").max(160, "Description must be at most 160 characters"),
  content: Yup.string().required("Content is Required"),
  bannerImage: Yup.string().url().required("Banner Image is required"),
  sourceUrl: Yup.string().url().required("Source URL is required"),
});