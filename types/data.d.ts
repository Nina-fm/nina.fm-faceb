/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface DataTableRow {
    item: {
      title: string
      value: any
      props: { title: string; value: any }
      children: any[]
      raw: any
    } & { type: "item"; columns: Record<string, unknown> }
  }
}

export {}
