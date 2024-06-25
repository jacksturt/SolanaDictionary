import { type Prisma } from "@prisma/client";

const entries: Prisma.EntryCreateInput[] = [
  {
    term: "Banking Stage",
    definition:
      "This is the stage where transactions are either forwarded or processed.",
    links: [
      {
        url: "https://github.com/solana-labs/solana/blob/master/core/src/banking_stage.rs",
        title: "Banking Stage Source Code",
      },
    ],
    longDefinition:
      "The bank stage will do one of two things depending on whether or not the validator is the leader. If it is the leader, then the transactions are processed, and those that do not fail are committed to the bank. If the validator is not the leader, then it will forward packets to the leader. ",
  },
  {
    term: "Transaction Processing Unit",
    acronym: "TPU",
    definition:
      "The TPU is the overall system that handles fetching, verifying, processing, etc... for transactions",
    links: [],
    longDefinition:
      "The TPU is designed to maximize the throughput and efficiency of transaction processing on the Solana blockchain. It handles multiple tasks including fetching transactions, verifying signatures, processing transactions, and forwarding results",
  },
  {
    term: "United States Dollar Coin",
    acronym: "USDC",
    definition: "A stable coin that has the same value as the US Dollar.",
    links: [
      {
        url: "https://www.circle.com/en/usdc",
        title: "USDC Website",
      },
    ],
    longDefinition:
      "This stable coin is provided by Circle, and is use widely across Solana, and other blockchains. Circle claims that each USDC is backed by a corresponding $USD.",
  },
  {
    term: "Turbine",
    definition: "Solana's block propagation step",
    links: [
      {
        url: "https://docs.solanalabs.com/consensus/turbine-block-propagation",
        title: "Turbine Block Propagation",
      },
    ],
    longDefinition:
      "Solana's block propagation protocol that breaks data into smaller packets to be distributed across the network efficiently. this is broken into three steps:\n" +
      "- data sharding: breaking the blocks into smaller data packets that are easier to distribute\n" +
      "- layered propogation: leader doesn't send data to all nodes. it sends to some, which in turn send to others, etc...\n" +
      "- erasure coding: a method of data protection that breaks data into fragments and encodes them with redundant data pieces. This allows the original data to be reconstructed from a subset of the fragments.",
  },
];

import { protectedProcedure } from "~/server/api/trpc";

export const seed = protectedProcedure.mutation(async ({ ctx }) => {
  if (!ctx.session.user.isAdmin) {
    throw new Error("You are not authorized to seed the database");
  }
  const { user } = ctx.session;
  await Promise.all(
    entries.map(async ({ term, definition, links, tags, longDefinition, acronym }) => {
      const entry = await ctx.db.entry.create({
        data: { term, definition, links, tags, longDefinition, acronym },
      });
      await ctx.db.userEntry.create({
        data: { userId: user.id, entryId: entry.id, isCreator: true },
      });
      return entry;
    }),
  );
  return true;
});
