import { BaseLevel } from "@/types/data/Level";
import { apiClient } from "../api-client";

export async function getAllLevels() {
  return (await apiClient.get<BaseLevel[]>("/api/levels")).data;
}
