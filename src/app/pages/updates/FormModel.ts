import * as Yup from "yup";

export interface IFormDetails {
  title: string;
  description: string;
  category: string;
}

export const formInitValues: IFormDetails = {
  title: "",
  description: "",
  category: "",
};

export const formDetailsSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").max(30, "Title must be at most 30 characters"),
  description: Yup.string().required("Description is required").max(300, "Description must be at most 300 characters"),
  category: Yup.string().required("Category is required"),
});
