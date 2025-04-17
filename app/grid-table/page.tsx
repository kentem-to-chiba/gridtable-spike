"use client";

import { ReactNode, useReducer } from "react";
import InputCell from "./_components/input-cell";

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
  bloodPressure: {
    systolic: number;
    diastolic: number;
    average: number;
  };
};

const isBloodPressure = (value: unknown): value is Person["bloodPressure"] => {
  if (typeof value !== "object" || value === null) return false;
  if (
    !("systolic" in value) ||
    !("diastolic" in value) ||
    !("average" in value)
  )
    return false;
  if (
    typeof value.systolic !== "number" ||
    typeof value.diastolic !== "number" ||
    typeof value.average !== "number"
  )
    return false;
  return true;
};

const columns: {
  accessorKey: keyof Person;
  header: ({
    columnAccessorKey,
    callbackFn,
  }: {
    columnAccessorKey: string;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
  cell: ({
    rowIndex,
    columnAccessorKey,
    value,
    callbackFn,
  }: {
    rowIndex: number;
    columnAccessorKey: string;
    value: unknown;
    callbackFn?: (value: unknown) => void;
  }) => ReactNode;
}[] = [
  {
    accessorKey: "id",
    header: () => <span>ID</span>,
    cell: ({ value, callbackFn }) => {
      if (typeof value !== "number") return null;
      return (
        <InputCell
          className="h-full"
          type="number"
          value={value}
          onChange={(e) => callbackFn?.(Number(e.target.value))}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <span>名前</span>,
    cell: ({ value, callbackFn }) => {
      if (typeof value !== "string") return null;
      return (
        <InputCell
          className="h-full"
          type="text"
          value={value}
          onChange={(e) => callbackFn?.(e.target.value)}
        />
      );
    },
  },
  {
    accessorKey: "age",
    header: () => <span>年齢</span>,
    cell: ({ value, callbackFn }) => {
      if (typeof value !== "number") return null;
      return (
        <InputCell
          className="h-full"
          type="number"
          value={value}
          onChange={(e) => callbackFn?.(Number(e.target.value))}
        />
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <span>メールアドレス</span>,
    cell: ({ value, callbackFn }) => {
      if (typeof value !== "string") return null;
      return (
        <InputCell
          className="h-full"
          type="email"
          value={value}
          onChange={(e) => callbackFn?.(e.target.value)}
        />
      );
    },
  },
  {
    accessorKey: "bloodPressure",
    header: () => (
      <div className="grid grid-cols-[1fr_1px_1fr] grid-rows-[1fr_1px_1fr] place-items-center">
        <div className="row-start-1 col-start-1 p-1">血圧上</div>
        <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
        <div className="row-start-3 col-start-1 p-1">血圧下</div>
        <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
        <div className="row-start-1 row-span-3 col-start-3 p-1">血圧平均</div>
      </div>
    ),
    cell: ({ value, callbackFn }) => {
      const valueAsUnknown: unknown = value;
      if (!isBloodPressure(valueAsUnknown)) return null;
      const { systolic, diastolic, average } = valueAsUnknown;

      return (
        <div className="grid grid-cols-[1fr_1px_1fr] grid-rows-[1fr_1px_1fr] place-items-center">
          <InputCell
            className="row-start-1 col-start-1 p-1 h-full"
            type="number"
            value={systolic}
            onChange={(e) =>
              callbackFn?.({
                ...valueAsUnknown,
                systolic: Number(e.target.value),
              })
            }
          />
          <div className="row-start-2 col-start-1 border-b border-gray-300 w-full h-full" />
          <InputCell
            className="row-start-3 col-start-1 p-1 h-full"
            type="number"
            value={diastolic}
            onChange={(e) =>
              callbackFn?.({
                ...valueAsUnknown,
                diastolic: Number(e.target.value),
              })
            }
          />
          <div className="row-start-1 row-span-3 col-start-2 border-r border-gray-300 w-full h-full" />
          <InputCell
            className="row-start-1 row-span-3 col-start-3 p-1 h-full"
            type="number"
            value={average}
            onChange={(e) =>
              callbackFn?.({
                ...valueAsUnknown,
                average: Number(e.target.value),
              })
            }
          />
        </div>
      );
    },
  },
];

const initialData: Person[] = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    email: "john@example.com",
    bloodPressure: { systolic: 120, diastolic: 80, average: 100 },
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 34,
    email: "jane@example.com",
    bloodPressure: { systolic: 130, diastolic: 85, average: 107.5 },
  },
  {
    id: 3,
    name: "Sam Johnson",
    age: 45,
    email: "sam@example.com",
    bloodPressure: { systolic: 140, diastolic: 90, average: 115 },
  },
];

type Action =
  | { type: "update"; rowIndex: number; accessorKey: "id"; value: Person["id"] }
  | {
      type: "update";
      rowIndex: number;
      accessorKey: "name";
      value: Person["name"];
    }
  | {
      type: "update";
      rowIndex: number;
      accessorKey: "age";
      value: Person["age"];
    }
  | {
      type: "update";
      rowIndex: number;
      accessorKey: "email";
      value: Person["email"];
    }
  | {
      type: "update";
      rowIndex: number;
      accessorKey: "bloodPressure";
      value: Person["bloodPressure"];
    };

export default function GridTablePage() {
  const [formState, formDispatch] = useReducer(
    (state: Person[], action: Action) => {
      switch (action.type) {
        case "update":
          return state.map((row, index) => {
            if (index === action.rowIndex) {
              return {
                ...row,
                [action.accessorKey]: action.value,
              };
            }
            return row;
          });
        default:
          return state;
      }
    },
    initialData,
  );

  const columnCallbackFn =
    ({
      columnAccessorKey,
      rowIndex,
    }: {
      columnAccessorKey: string;
      rowIndex: number;
    }) =>
    (value: unknown) => {
      switch (columnAccessorKey) {
        case "id": {
          if (typeof value === "number") {
            formDispatch({
              type: "update",
              rowIndex,
              accessorKey: columnAccessorKey,
              value,
            });
          }
          break;
        }
        case "name": {
          if (typeof value === "string") {
            formDispatch({
              type: "update",
              rowIndex,
              accessorKey: columnAccessorKey,
              value,
            });
          }
          break;
        }
        case "age": {
          if (typeof value === "number") {
            formDispatch({
              type: "update",
              rowIndex,
              accessorKey: columnAccessorKey,
              value,
            });
          }
          break;
        }
        case "email": {
          if (typeof value === "string") {
            formDispatch({
              type: "update",
              rowIndex,
              accessorKey: columnAccessorKey,
              value,
            });
          }
          break;
        }
        case "bloodPressure": {
          if (isBloodPressure(value)) {
            formDispatch({
              type: "update",
              rowIndex,
              accessorKey: columnAccessorKey,
              value,
            });
          }
          break;
        }
        default:
          break;
      }
    };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Grid Table</h1>
      <table className="table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr className="border-b border-gray-300 h-full">
            {columns.map((column) => (
              <th
                key={column.accessorKey}
                className="border border-gray-300 h-full"
              >
                {column.header({
                  columnAccessorKey: column.accessorKey,
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white">
          {formState.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-300 h-full">
              {columns.map((column) => (
                <td
                  key={column.accessorKey}
                  className="border border-gray-300 h-full"
                >
                  {column.cell({
                    rowIndex,
                    columnAccessorKey: column.accessorKey,
                    value: row[column.accessorKey],
                    callbackFn: columnCallbackFn({
                      columnAccessorKey: column.accessorKey,
                      rowIndex,
                    }),
                  })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
