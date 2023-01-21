import type { Database } from "../_types/supabase.ts";
import type { GetResult } from "https://esm.sh/@supabase/postgrest-js@2/dist/module/select-query-parser";

export type DbTables = Database["public"]["Tables"];
export type DbEnums = Database["public"]["Enums"];

type GetDB<
  T extends keyof DbTables,
  F extends keyof DbTables[T]
> = DbTables[T][F];

export type DbEnum<T extends string> = TypeFromPath<DbEnums, T>;

export type Role = DbEnum<"roles">;

export type Db<T extends string> = TypeFromPath<DbTables, T>;

export type DParams<T extends keyof DbTables> = GetDB<T, "Update">;
export type DType<T extends keyof DbTables> = GetDB<T, "Row">;

type SplitRelStr_SuccessProps<T = keyof DbTables, Q = string> = {
  table: T;
  query: Q;
};

type SplitRelStr<RelStr extends string> =
  RelStr extends `${infer T}(${infer Q})`
    ? T extends keyof DbTables
      ? SplitRelStr_SuccessProps<T, Q>
      : {
          error: "Parsed `RelationString`, but the table name does not exist.";
        }
    : { error: "Cannot parse `RelationString`" };

type GetResolvedResult<SP extends SplitRelStr_SuccessProps> = GetResult<
  Database["public"],
  DbTables[SP["table"]]["Row"],
  SP["query"]
>;

/**
 * @template RelStr Supabase relation string, e.g. `tablename(colum, another_colum)`.
 * @template RelType The type of relation. e.g. `one` or `many`. This decides if the returned relation is an array of objects/single object.
 */
export type ResolveRelationQuery<
  RelStr extends string,
  RelType extends "one" | "many" = "many",
  Nullable extends boolean = true
> = SplitRelStr<RelStr> extends SplitRelStr_SuccessProps
  ? {
      [K in SplitRelStr<RelStr>["table"]]: RelType extends "one"
        ? Nullable extends true
          ? GetResolvedResult<SplitRelStr<RelStr>> | null
          : GetResolvedResult<SplitRelStr<RelStr>>
        : GetResolvedResult<SplitRelStr<RelStr>>[];
    }
  : { error: SplitRelStr<RelStr>["error"] };

/**
 * @template R { data } response you get from `const { data, error } = await supabase.from('tablename').select(...)`
 * @template RelObj Object that contains the table name and the resolved relation.
 */
// deno-lint-ignore no-explicit-any, ban-types
export type ResolveResponse<R extends any[], RelObj extends object> = (R[0] &
  RelObj)[];
