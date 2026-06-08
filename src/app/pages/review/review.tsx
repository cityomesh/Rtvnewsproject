/* eslint-disable @typescript-eslint/ban-types */
import * as Yup from 'yup';


export interface IReview {
    
    // videoURL: string,
    title: String,
    reviewComment: String | null,
    trainingRating: Number | null,
    reviewStatus: String
}

export const initReviewVal: IReview = {
    
    title: "",
    // videoURL: "",
    reviewComment: "",
    trainingRating: 0,
    reviewStatus: ""
}

export const createReviewSchema = Yup.object().shape({
    title: Yup.string(),
    reviewComment: Yup.string().required().label("Review Comment"),
    trainingRating: Yup.number().required().min(0).max(10).label("Rating"),
    reviewStatus: Yup.string()
})


