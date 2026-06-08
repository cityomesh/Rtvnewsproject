import * as Yup from "yup";

export interface ICreateTutorialsFormDetails {
  topic: string;
  content: string;
  sourceUrl: string | null;
  category: string;
  imageUrl: string | null;
  videoUrl: string | null;
}

export const createTutorialsFormInitValues: ICreateTutorialsFormDetails = {
  topic: "",
  content: "",
  sourceUrl: "",
  category: "",
  imageUrl: "",
  videoUrl: "",
};

export const extractText = (htmlString: string) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const contentValidationSchema = Yup.string()
  .required("Content is required")
  .test(
    "is-content-empty", // Name of the test
    "Content cannot be empty",
    (value) => {
      const plainText = extractText(value);
      return plainText.trim().length > 0;
    }
  );

export const createTutorialsFormDetailsSchema = Yup.object().shape({
  topic: Yup.string()
    .required("Title is required")
    .max(50, "Topic must be at most 50 characters"),
  content: contentValidationSchema,
  sourceUrl: Yup.string().url().nullable().label("Source URL"),
  category: Yup.string().required("Category is required"),
  imageUrl: Yup.string().url().nullable(),
  videoUrl: Yup.string().url().nullable(),
});
