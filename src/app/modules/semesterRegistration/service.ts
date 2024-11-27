import {
  Prisma,
  PrismaClient,
  SemesterRegistration,
  SemesterRegistrationStatus,
} from "@prisma/client";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import {
  ICondition,
  ISemesterRegistrationFilters,
  sortOrder,
} from "./interface";
import { paginationHelper } from "../../../helper/paginationHelper";
import { semesterRegistrationSearchableFields } from "./contants";

const prisma = new PrismaClient();

const createSemesterRegistration = async (
  payload: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationExist =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegistrationExist) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester reistration already ongoing or upcoming"
    );
  }
  const result = await prisma.semesterRegistration.create({
    data: payload,
  });
  return result;
};

const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: sortOrder } = {};

  const andCondition: ICondition[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: semesterRegistrationSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive" as Prisma.QueryMode,
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      AND: Object.entries(filterData).map(([field, value]) => ({
        [field]: value as string | number | boolean | null,
      })),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andCondition.length > 0 ? { AND: andCondition } : {};

  const result = await prisma.semesterRegistration.findMany({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined},
    where: whereConditions,
    orderBy: sortConditions,
    skip,
    take: limit,
  });

  let total = await prisma.semesterRegistration.count({
    // where: {AND: andCondition.length > 0 ? andCondition : undefined,}
    where: whereConditions,
  });

  if (result.length === 0 && searchTerm) {
    const searchTermAsNumber = Number(searchTerm);
    if (!isNaN(searchTermAsNumber)) {
      andCondition.length = 0;
      andCondition.push({
        OR: semesterRegistrationSearchableFields.map((field) => ({
          [field]: searchTermAsNumber,
        })),
      });

      const result = await prisma.semesterRegistration.findMany({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined },
        where: whereConditions,
        orderBy: sortConditions,
        skip,
        take: limit,
      });

      // Count the total matching documents
      total = await prisma.semesterRegistration.count({
        // where: { AND: andCondition.length > 0 ? andCondition : undefined},
        where: whereConditions,
      });
    }
  }

  return {
    meta: {
      total,
      limit: 10,
      page,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findFirst({
    where: { id: id },
  });
  return result;
};

const deleteSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const result = await prisma.semesterRegistration.delete({
    where: { id: id },
    include: {
      academicSemester: true,
    },
  });
  return result;
};

// thorough check
// const updateSemesterRegistration = async (
//   id: string,
//   payload: Partial<SemesterRegistration>
// ): Promise<SemesterRegistration> => {
//   // Fetch the current semester registration status
//   const currentSemester = await prisma.semesterRegistration.findUnique({
//     where: { id: id },
//     select: { status: true },
//   });

//   if (!currentSemester) {
//     throw new ApiError(
//       httpStatus.BAD_REQUEST,
//       "Semester registration not found"
//     );
//   }

//   // Validate and update the status based on the current status
//   if (payload.status) {
//     const currentStatus = currentSemester.status;

//     if (currentStatus === "UPCOMING" && payload.status !== "ONGOING") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status can only be updated from 'UPCOMING' to 'ONGOING'."
//       );
//     }

//     if (currentStatus === "ONGOING" && payload.status !== "ENDED") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status can only be updated from 'ONGOING' to 'ENDED'."
//       );
//     }

//     if (currentStatus === "ENDED") {
//       throw new ApiError(
//         httpStatus.BAD_REQUEST,
//         "Invalid status update: Status cannot be changed from 'ENDED'."
//       );
//     }
//   }

//   const result = await prisma.semesterRegistration.update({
//     where: { id: id },
//     data: payload,
//     include: {
//       academicSemester: true,
//     },
//   });
//   return result;
// };

// transition map check
const updateSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  // Define allowed status transitions
  const statusTransitionMap: Record<
    SemesterRegistrationStatus,
    SemesterRegistrationStatus | null
  > = {
    UPCOMING: "ONGOING",
    ONGOING: "ENDED",
    ENDED: null, // No transitions allowed
  };

  // Fetch the current semester registration status
  const currentSemester = await prisma.semesterRegistration.findUnique({
    where: { id: id },
    select: { status: true },
  });

  if (!currentSemester) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Semester registration not found"
    );
  }

  const currentStatus = currentSemester.status as SemesterRegistrationStatus;

  // Validate the status transition if `status` is being updated
  if (payload.status && payload.status !== statusTransitionMap[currentStatus]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Invalid status update: Status can only transition from '${currentStatus}' to '${
        statusTransitionMap[currentStatus] ?? "no further state"
      }'.`
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: { id: id },
    data: payload,
    include: {
      academicSemester: true,
    },
  });
  return result;
};

export const semesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  deleteSemesterRegistration,
  updateSemesterRegistration,
};
