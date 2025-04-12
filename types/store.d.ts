declare global {
  interface DataStore<T> {
    data: T[]
    index: Record<string | number, T>
    current?: T
  }
}

export {}
