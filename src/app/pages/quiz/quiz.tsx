import * as Yup from "yup";

export interface IOption {
  label: string;
  correctAnswer: boolean;
}

export const initOptionVal: IOption = {
  label: "",
  correctAnswer: false,
};

export interface IQuestion {
  question: string;
  options: IOption[];
}

export const initQuestionVal: IQuestion = {
  question: "",
  options: [],
};

export interface IShare {
  text: string;
}

export const initShareVal: IShare = {
  text: "",
};

export interface IQuiz {
  questions: IQuestion[];
  status: string;
  rewardCoinsPerQuestion: number;
  quizType: string;
  updatedAt?: string;
  // share: IShare | null;
  responseCount?: string;
}
export const initQuizVal: IQuiz = {
  questions: [],
  status: "",
  rewardCoinsPerQuestion: 0,
  quizType: '',
  updatedAt: '',
  // share: null,
};


// types.ts
export interface QuizOption {
  id: string;
  label: string;
  answered: boolean;
  correctAnswer: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
}

export type QuizStatus = 'ACTIVE' | 'INACTIVE'; // Extend as needed
export type QuizType = 'MUSIC' | 'FILM' | 'MATCH' | string; // Extend as needed

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  status: QuizStatus;
  rewardCoinsPerQuestion: number;
  quizType: QuizType;
}

export type QuizApiResponse = Quiz[];




export const createOptionSchema = Yup.object().shape({
  label: Yup.string().max(36).required().label("Option"),
  correctAnswer: Yup.boolean(),
});
export const createQuestionSchema = Yup.object().shape({
  question: Yup.string().max(80).required("Question is required"),
  options: Yup.array()
    .of(createOptionSchema)
    .min(2, "Atleast 2 options required")
    .max(4, "Atmost 4 options are allowed")
    .required("Options are required")
    .test(
        'correctAnswer-selected',
        'At least one correct answer is required',
        (options = []) => options.some(option => option.correctAnswer)
      )
});

export const createQuizSchema = Yup.object().shape({
  questions: Yup.array()
    .of(createQuestionSchema)
    .min(2, "At least 2 questions are required")
    .max(6, "Atmost 6 questions are allowed")
    .required("Questions are required"),
  status: Yup.string().required().label("Status"),
  rewardCoinsPerQuestion: Yup.number()
    .required("Rewards per question is required")
    .min(10, "Minimum 10 reward coins are required")
    .label("Rewards per question"),
  // share: Yup.object().shape({
  //   text: Yup.string().required('Sharing text is required')
  // }),
});
