import { Institution } from "@/types/data/Institution"
import { apiClient } from "../api-client"

export async function getAllInstitutions(): Promise<Institution[]> {
    const response = await apiClient.get<Institution[]>("/api/institutions");
    console.log(`institutions: ${JSON.stringify(response.data)}`)
    return response.data;
}

export async function getInstitutionById(id: string): Promise<Institution> {
    const response = await apiClient.get<Institution>(`/api/institutions/${id}`);
    return response.data;
}