import userService from '../../services/user.service';

const mentions = async () => {
  try {
    const { data } = await userService.getUsers(
      { status: 'active' },
      { page: 1, limit: 100 }
    );

    return data?.users.map((user) => ({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    }));
  } catch (error) {
    return [];
  }
};

export default mentions;
