import * as Yup from 'yup';

export interface ICourse {
    level: string
}

export const initCourseVal: ICourse = {
    level: ""
}

export const createCourseSchema = Yup.object().shape({
    level: Yup.string().required().label("Name"),
})