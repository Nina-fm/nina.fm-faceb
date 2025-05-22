type Action = (...params: any[]) => Promise<any>

export const useAction = () => {
  const pending = ref(false)

  const defineAction = async (action: Action) => {
    pending.value = true
    try {
      const result = await action()
      return result
    } catch (error) {
      console.error('Error executing action:', error)
      return null
    } finally {
      pending.value = false
    }
  }

  const defineDelayedAction = async (action: Action, delay?: number) => {
    pending.value = true
    try {
      const result = await action()
      await sleep(delay ?? 500)
      return result
    } catch (error) {
      console.error('Error executing action:', error)
      return null
    } finally {
      pending.value = false
    }
  }

  return {
    defineAction,
    defineDelayedAction,
    pending,
  }
}
