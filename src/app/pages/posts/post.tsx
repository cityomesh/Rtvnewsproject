// post.tsx
import * as Yup from "yup";

export interface IPost {
  title: string;
  description: string;
  bannerImage: string | null;
  insights: {
    noOfComments: number;
    noOfLikes: number;
  };
  liked: boolean;
  video: {
    externalFile: {
      url: string | null;
    } | null;
    internalFile: {
      video: string | null;
      thumbnail: string | null;
    } | null;
  };
}

export const initPostVal: IPost = {
  title: "",
  description: "",
  bannerImage: null,
  insights: {
    noOfComments: 0,
    noOfLikes: 0,
  },
  liked: false,
  video: {
    externalFile: {
      url: null,
    },
    internalFile: {
      video: null,
      thumbnail: null,
    },
  },
};

export const maxCharForTextInput = 100;
export const maxCharForDescription = 300;

export const createPostSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .max(maxCharForTextInput, `Title cannot exceed ${maxCharForTextInput} characters`),

  description: Yup.string()
    .optional()
    .test(
      "len",
      `Description cannot exceed ${maxCharForDescription} characters`,
      (value) => {
        if (!value) return true;
        const plainText = value.replace(/<\/?[^>]+(>|$)/g, "");
        return plainText.length <= maxCharForDescription;
      }
    ),

  bannerImage: Yup.string()
    .nullable()
    .when("video", {
      is: (video: any) =>
        !video?.internalFile?.video && !video?.externalFile?.url,
      then: (schema) => schema.required("Banner image or video is required"),
      otherwise: (schema) => schema.nullable(),
    }),

  video: Yup.object()
    .shape({
      externalFile: Yup.object()
        .shape({
          url: Yup.string().nullable(),
        })
        .nullable(),
      internalFile: Yup.object()
        .shape({
          video: Yup.string().url("Video URL must be valid").nullable(),
          thumbnail: Yup.string().url("Thumbnail URL must be valid").nullable(),
        })
        .nullable(),
    })
    .nullable()
    .test(
      "at-least-one-video",
      "Either internal or external video is required when no banner image is provided",
      function (video) {
        const { bannerImage } = this.parent;
        if (bannerImage) return true;
        const internalVideo = video?.internalFile?.video;
        const externalUrl = video?.externalFile?.url;
        return Boolean(internalVideo || externalUrl);
      }
    ),
});
