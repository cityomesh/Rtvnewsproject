import * as Yup from "yup";

export interface IOption {
    label: string;
    optionPercentage: number;
    isCorrectChoice: boolean;
    isMarked: boolean;
}
export interface IQuestion {
    title: string;
    options: IOption[];
}
export interface IResponseCount {
    responseCount: number
}
export interface IPoll {
    question: IQuestion,
    responseStats: IResponseCount,
    expiryDate: string | null;
}
export const initResponseCount: IResponseCount = {
    responseCount: 0
}
export const initQuestion: IQuestion = {
    title: "",
    options: []
}
export const initOption: IOption = {
    label: "",
    optionPercentage: 0,
    isCorrectChoice: false,
    isMarked: false,
}
export const initPoll:IPoll = {
    question: initQuestion,
    responseStats: initResponseCount,
    expiryDate: null,
}
export const maxCharForTextInput = 80
export const createOptionSchema = Yup.object().shape({
    label: Yup.string().max(maxCharForTextInput).required().label("Option"),
    optionPercentage: Yup.number().max(100).min(0).default(0),
    isCorrectChoice: Yup.boolean().default(false),
    isMarked: Yup.boolean().default(false),
});

export const createQuestionSchema = Yup.object().shape({
    title: Yup.string().max(maxCharForTextInput).required("Question title is required"),
    options: Yup.array()
      .of(createOptionSchema)
      .min(2, "Atleast 2 options required")
      .max(4, "Atmost 4 options are allowed")
      .required("Options are required")
});

export const createResponseStatus = Yup.object().shape({
    responseCount: Yup.number().min(0).default(0)
})


export const createPollSchema = Yup.object().shape({
    question: createQuestionSchema,
    responseStatus: createResponseStatus,
    expiryDate: Yup.string()
        .required('Expiry Date is required')
        .transform(function(value, originalValue) {
            const newValue = (new Date(value)).toISOString()
            return newValue
        }),
});

