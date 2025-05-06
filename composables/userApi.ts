export const useUserApi = () => {
  const fetchUsers = async (params?: { page: number; limit: number }) => {
    return await $fetch('/api/users', {
      method: 'GET',
      params,
    })
  }

  const getUserById = async (id: string) => {
    return await $fetch('/api/user', {
      method: 'GET',
      params: { id },
    })
  }

  const editUser = async (id: string, userData: UserEdit) => {
    return await $fetch('/api/user', {
      method: 'PUT',
      body: { id, ...userData },
    })
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
