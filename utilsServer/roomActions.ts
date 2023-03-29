// /* socket io generates new if for each connection and therefore we can use it to keep track of connected users */

const users: { userId: string; socketId: string }[] = [];

export const addUser = async (userId: string, socketId: string) => {
  const user = users.find((user) => user.userId === userId);
  if (user && user.socketId === socketId) {
    return users;
  } else {
    if (user && user.socketId !== socketId) {
      await removeUser(user.socketId);
    }

    const newUser = { userId, socketId };
    users.push(newUser);

    return users;
  }
};

export const removeUser = async (socketId: string) => {
  const indexof = users.map((user) => user.socketId).indexOf(socketId);
  users.splice(indexof, 1);
  return;
};

export const findConnectedUser = (userId: string): string | null => {
  const user = users.find((user) => user.userId === userId);
  if (!user) return null;
  else return user.socketId;
};
