export const useUserApi = () => {
  const fetchUsers = async (params?: { page: number; limit: number }) => {
    const result = await $fetch('/api/users', {
      method: 'GET',
      params,
    })

    return result
  }

  const getUserById = async (id: string) => {
    const user = await $fetch('/api/user', {
      method: 'GET',
      params: { id },
    })
    if (!user) {
      return null
    }
    return user
  }

  const editUser = async (id: string, userData: UserEdit) => {
    const user = await $fetch('/api/user', {
      method: 'PUT',
      body: { id, ...userData },
    })
    if (!user) {
      return null
    }
    return user
  }

  const deleteUser = async (id: string | number) => {
    await $fetch('/api/user', {
      method: 'DELETE',
      params: {
        id,
      },
    })
  }

  return {
    getUserById,
    fetchUsers,
    editUser,
    deleteUser,
  }
}
