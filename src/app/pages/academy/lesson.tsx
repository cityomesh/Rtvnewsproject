import * as Yup from 'yup';

export interface ILesson {
    courseId: string,
    level: string,
    title: string,
    videoUrl: string,
    // videoFile: String,
    videoFile: File | null,
    thumbnailUrl: string,
    description: string,
    quizId: string,
}

export const initLessonVal: ILesson = {
    courseId: "",
    level: "",
    title: "",
    videoUrl: "",
    // videoFile:"",
    videoFile: null,
    thumbnailUrl: "",
    description: "",
    quizId: "",
}

export const createLessonSchema = Yup.object().shape({
    courseId: Yup.string().required().label("CourseId"),
    level: Yup.string().required().label("Level"),
    title: Yup.string().required().label("Title"),
    videoFile: Yup.mixed<File>()
    .required('Video file is required')
    .test(
      'fileSize',
      'The video file is too large, File size could not exceed 300MB',
      (value) => {
        if (value && value.size) {
          const maxSizeInBytes = 300 * 1024 * 1024;
          return value.size <= maxSizeInBytes;
        }
        return false;
      }
    ).label("Video"),
    // videoUrl: Yup.string().required().label("VideoUrl"),
    thumbnailUrl: Yup.string().required().label("ThumbnailUrl"),
    description: Yup.string().required().label("Description"),
    quizId: Yup.string().label("QuizId"),
})