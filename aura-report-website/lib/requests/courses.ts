import { BaseCourse } from "@/types/data/Course";
import { apiClient } from "../api-client";

export async function getAllCourses() {
  let courses = (await apiClient.get<BaseCourse[]>("/api/classes")).data;
  console.log(`classes fetched: ${JSON.stringify(courses)}`);
  return courses;
}
