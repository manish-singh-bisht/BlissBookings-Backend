const prisma = require("../../../lib/prisma");

exports.deleteUserInDatabase = async (userId) => {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
