import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import {
  ExpandedLesson,
  LessonPlanStatus,
  LessonReviewStatus,
  LessonStatus,
} from "@/types/data/Lesson";
import { ReactNode, useMemo } from "react";
import CreateLessonForm from "../create-lesson-form/CreateLessonForm";
import EditLessonDetailsForm from "../edit-lesson-form/EditLessonDetailsForm";
import { Row } from "@tanstack/react-table";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import {
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  LapTimerIcon,
  MinusCircledIcon,
  TrackNextIcon,
} from "@radix-ui/react-icons";
import { convertTimestampToDateTime } from "@/utils/time-utils";

const LESSON_STATUS_ICON_MAPPING: Record<LessonStatus, ReactNode> = {
  UPCOMING: <ArrowUpIcon className='text-yellow-400' />,
  ONGOING: <LapTimerIcon className='text-blue-400' />,
  COMPLETED: <CheckCircledIcon className='text-green-400' />,
  CANCELLED: <MinusCircledIcon className='text-red-400' />,
  POSTPONED: <TrackNextIcon className='text-gray-400' />,
};

const LESSON_PLAN_STATUS_ICON_MAPPING: Record<LessonPlanStatus, ReactNode> = {
  PLANNED: <CheckCircledIcon className='text-green-400' />,
  NOT_PLANNED: <CrossCircledIcon className='text-red-400' />,
};

const LESSON_REVIEW_STATUS_ICON_MAPPING: Record<LessonReviewStatus, ReactNode> =
  {
    NOT_REVIEWED: <CrossCircledIcon className='text-red-400' />,
    REVIEWED: <CheckCircledIcon className='text-green-400' />,
  };

export default function LessonsTable() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: expandedLessons = [], refetch } =
    LessonsApis.useGetAllLessonsOfOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const columns = useMemo<TableColumnDef<ExpandedLesson>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>LESSON NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={[row.course.name]} />
        ),
        id: "courses",
        header: ({ table }) => <span>CLASSES ENROLLED</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <div className='flex gap-2 items-center'>
            {LESSON_STATUS_ICON_MAPPING[row.lesson_status]}
            <p>{row.lesson_status}</p>
          </div>
        ),
        id: "lesson_status",
        header: ({ table }) => <span>LESSON STATUS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <div className='flex gap-2 items-center'>
            {LESSON_PLAN_STATUS_ICON_MAPPING[row.lesson_plan_status]}
            <p>{row.lesson_plan_status}</p>
          </div>
        ),
        id: "lesson_plan_status",
        header: ({ table }) => <span>LESSON PLAN STATUS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <div className='flex gap-2 items-center'>
            {LESSON_REVIEW_STATUS_ICON_MAPPING[row.lesson_review_status]}
            <p>{row.lesson_review_status}</p>
          </div>
        ),
        id: "lesson_review_status",
        header: ({ table }) => <span>LESSON REVIEW STATUS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },

      {
        accessorFn: (row) => {
          const { date: start_date, time: start_time } =
            convertTimestampToDateTime(row.lesson_start_timestamptz);
          const { date: end_date, time: end_time } = convertTimestampToDateTime(
            row.lesson_end_timestamptz,
          );

          return (
            <div>
              <p>
                {start_date} ~ {end_date}
              </p>
              <p>
                {start_time} - {end_time}
              </p>
            </div>
          );
        },

        id: "date_and_time",
        header: ({ table }) => <span>DATE & TIME</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.students.map((s) => s.name)} />
        ),
        id: "students",
        header: ({ table }) => <span>STUDENTS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => {
          return row.educators.length > 0 ? (
            <ConcatenatedLinksList links={row.educators.map((s) => s.name)} />
          ) : (
            <div>N/A</div>
          );
        },
        id: "educators",
        header: ({ table }) => <span>EDUCATORS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },

      {
        accessorFn: (row) => <span>{row.description || "N/A"}</span>,
        id: "description",
        header: ({ table }) => <span>DESCRIPTION</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );

  const renderEditLessonForm = (row: Row<ExpandedLesson>) => {
    return <EditLessonDetailsForm lesson={row.original} />;
  };
  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedLessons}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateLessonForm onSuccess={onSuccess} />
              )}
              buttonTitle={"Create Lesson"}
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent editRowContent={renderEditLessonForm} />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
