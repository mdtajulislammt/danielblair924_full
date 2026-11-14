"use client";

import React from "react";
import Loader from "./Loader";

interface ColumnConfig {
  label: React.ReactNode;
  width: any;
  accessor: string;
  formatter?: (value: any, row: any) => React.ReactNode;
}

interface DynamicTableProps {
  columns: any;
  data: any[];
  noDataMessage?: string;
  loading?: boolean;
  width?: string;
  error?: string;
  border?: boolean;
  renderFooter?: (colSpan: number) => React.ReactNode;
}

export default function DynamicTable({
  columns,
  data,
  width,
  border = true,
  loading,
  noDataMessage = "No data found !.",
  error,
  renderFooter,
}: DynamicTableProps) {
  return (
    <div>
      {/* Table Wrapper with Border & Radius */}
      <div className={`rounded-t-md `}>
        <div className={` overflow-auto  `}>
          <table
            className={`${width} w-full text-left   ${border ? "p-2" : ""}`}
          >
            <thead className=" sticky top-0 text-white uppercase rounded-2xl! overflow-hidden  p-2">
              <tr className="">
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ width: col.width || "auto" }}
                    className={`${index == 0 ? "rounded-l-lg" : index === columns.length - 1 ? "rounded-r-lg" : ""} px-3!    py-4! text-sm font-medium border-b border-borderColor   `}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-10 text-center text-[#4a4c56] text-sm"
                  >
                    <Loader />
                  </td>
                </tr>
              ) : data?.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="border-t border-borderColor">
                    {columns.map((col, idx) => (
                      <td
                        key={idx}
                        style={{ width: col.width || "auto" }}
                        className="px-3 py-3 text-sm text-descriptionColor"
                      >
                        {col.formatter
                          ? col.formatter(row[col.accessor], row)
                          : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-3 py-10 text-center text-[#4a4c56] text-sm"
                  >
                    {error ? (
                      <p className="text-red-500 text-xl capitalize font-semibold">
                        {" "}
                        {error + " " + "please login again"}
                      </p>
                    ) : (
                      <p className="text-xl text-gray-500 capitalize font-semibold">
                        {noDataMessage}
                      </p>
                    )}
                  </td>
                </tr>
              )}
              {/* data rows */}
            </tbody>
            {renderFooter && <tfoot>{renderFooter(columns.length)}</tfoot>}
          </table>
        </div>
      </div>
      <div></div>
    </div>
  );
}
