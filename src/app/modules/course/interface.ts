import { Prisma } from "@prisma/client";

export type ICourseCreateData = {
    title:string,
    code:string,
    credits:number,
    preRequisiteCourses:{
        courseId:string
    }[]
}

export type sortOrder = 'asc' | 'desc';

export type ICondition = {
    // OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[];
    OR?: { [key: string]: { contains: string; mode: Prisma.QueryMode } }[] | { [key: string]: number }[];
    AND?: { [key: string]: string | number | boolean | null }[];
};

export type ICourseilters = {
    searchTerm?: string;
};


type CourseBase = {
    id: string;
    title: string;
    code: string;
    creadits: number;
    createdAt: Date;
    updatedAt: Date;
  };
  
  type CourseToPrerequisite = {
    courseId: string;
    preRequisiteId: string;
    preRequisite: CourseBase; // Nested course
  };
  
  type CourseWithRelations = CourseBase & {
    preRequisite: CourseToPrerequisite[]; // Prerequisites for this course
    preRequisiteFor: CourseToPrerequisite[]; // Courses where this is a prerequisite
  };

  export type NullableCourseWithRelations = CourseWithRelations | null;