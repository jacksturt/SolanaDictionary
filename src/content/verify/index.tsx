"use client";
import styles from "~/styles/Leaderboard.module.scss";
import { DataTable } from "~/app/_components/tables/DataTable";
import { type Entry } from "~/server/api/routers/entry/read";
import { type ColumnDef } from "@tanstack/react-table";
import Modal from "~/app/_components/Modal";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { CreateEntry } from "~/app/_components/create-entry";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { cn } from "~/utils";
import { VerificationRequest } from "~/server/api/routers/verificationRequests/read";

const columns: ColumnDef<VerificationRequest>[] = [
  {
    accessorKey: "user.name",
    header: "Name",
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => <div>{row.getValue("details")}</div>,
  },
  {
    accessorKey: "approve",
    header: "Approve",
    cell: ({ row }) => {
      console.log("row", row.getValue("id"));
      row.getValue;
      const processVerificationRequest =
        api.verificationRequest.processVerificationRequest.useMutation();

      return (
        <button
          onClick={() => {
            processVerificationRequest.mutate({
              id: row.original.id,
              isApproval: true,
            });
          }}
        >
          Approve
        </button>
      );
    },
  },
  {
    accessorKey: "reject",
    header: "Reject",
    cell: ({ row }) => {
      const processVerificationRequest =
        api.verificationRequest.processVerificationRequest.useMutation();

      return (
        <button
          onClick={() => {
            processVerificationRequest.mutate({
              id: row.original.id,
              isApproval: false,
            });
          }}
        >
          Reject
        </button>
      );
    },
  },
];

function VerifyContent({
  verificationRequests,
}: {
  verificationRequests: VerificationRequest[] | undefined;
}) {
  return (
    <div className={styles.content}>
      <div className={styles.innerContent}>
        {verificationRequests && (
          <DataTable columns={columns} data={verificationRequests} />
        )}
      </div>
    </div>
  );
}

export { VerifyContent };
