import axios from "axios";

export const wca = axios.create({
    baseURL: "https://www.worldcubeassociation.org/api/v0/persons/"
});


export const callPerson = async (wca_id) => {
    const response = await wca.get(wca_id);
    return response.data;
}
