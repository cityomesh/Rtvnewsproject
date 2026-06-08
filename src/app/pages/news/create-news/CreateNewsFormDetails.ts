import * as Yup from "yup";
import React from "react";
import ReactQuill from "react-quill";

/**
 * Interface for a single Story Card.
 * Matches the UI: No title, only description and image.
 */
export interface IStoryCard {
  id: string;
  description: string | null;
  bannerImage: string;
}

/**
 * The payload structure for creating a "Story".
 * Contains only the array of story cards.
 */
export interface IStoryPayload {
  storyCards: IStoryCard[] | null;
}

/**
 * The payload structure for creating a standard "News Article".
 * Contains title, description, and either a banner image or a video.
 */
export interface INewsArticlePayload {
  title: string | null;
  description: string | null;
  bannerImage: string | null;
  video: {
    internalFile: {
      video: string | null;
      thumbnail: string | null;
    };
    externalFile: {
      url: string | null;
    };
  } | null;
  categoryType: string | null;
  district:string | null;
  tags?: string[] | null;
}

export const newsArticleInitialValues: INewsArticlePayload = {
  title: null,
  description: null,
  bannerImage: null,
  video: null,
  categoryType:null,
  district:null,
  tags: [],
};

export const storyInitialValues: IStoryPayload = {
  storyCards: [],
};

export const newsArticleSchema = (
  quillRef: React.RefObject<ReactQuill>,
  mediaType: 'image' | 'video'
) =>
  Yup.object().shape({
    title: Yup.string()
      .max(100, "Title must be at most 100 characters")
      .nullable(),
    description: Yup.string()
      .test(
        'char-count',
        `Description must be at most 600 characters`,
        function (value) {
          if (!quillRef.current) return true;
          const textLength = quillRef.current.getEditor().getLength() - 1;
          return textLength <= 600;
        }
      )
      .nullable(),
    bannerImage: Yup.string().when([], {
      is: () => mediaType === 'image',
      then: (schema) => schema.url("Invalid URL").required("Banner Image is required"),
      otherwise: (schema) => schema.nullable(),
    }),
    video: Yup.mixed().when([], {
      is: () => mediaType === 'video',
      then: (schema) =>
        Yup.object()
          .shape({
            internalFile: Yup.object().shape({
              video: Yup.string().nullable(),
              thumbnail: Yup.string().nullable(),
            }).nullable(),
            externalFile: Yup.object().shape({
              url: Yup.string().nullable(),
            }).nullable(),
          })
          .test(
            'video-source-required',
            'Either an uploaded video or an external URL is required',
            (value) => {
              if (!value) return false;
              return !!(value.internalFile?.video || value.externalFile?.url);
            }
          )
          .nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
    tags: Yup.array().of(Yup.string()).nullable(),
  });

/**
 * Validation schema for the Story form.
 */
export const storySchema = Yup.object().shape({
  storyCards: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required(),
        description: Yup.string().nullable(),
        bannerImage: Yup.string().url('Invalid URL').required('Card image is required'),
      })
    )
    .min(1, 'At least one story card is required.')
    .required('Story cards are required')
    .default([])  // Provide a default value
    .transform((value) => Array.isArray(value) ? value : []), // Ensure it's always an array
});