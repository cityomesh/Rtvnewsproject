import * as Yup from 'yup';

export interface IPodcast {
    title: string,
    description: string,
    imageUrl: string,
    audioFileUrl: string,
}

export const initPodcastVal: IPodcast = {
    title: "",
    description: "",
    imageUrl: "",
    audioFileUrl: "",
}

export const createPodcastSchema = Yup.object().shape({
    title: Yup.string().required().label("Title"),
    description: Yup.string().required().label("Description"),
    imageUrl: Yup.string().required().label("Image Url"),
    audioFileUrl: Yup.string().required().label("Audio File Url"),
})