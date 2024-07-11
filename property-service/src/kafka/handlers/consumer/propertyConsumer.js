const prisma = require("../../../lib/prisma");
const { sendMessage } = require("../../producer");

exports.deletePropertiesOfUserInDatabase = async (hostId) => {
  try {
    const properties = await prisma.property.findMany({
      where: { hostId },
    });

    if (properties.length === 0) {
      return;
    }

    for (const property of properties) {
      await prisma.property.delete({
        where: { id: property.id },
      });

      await sendMessage("property-topic", {
        event: "delete-property",
        propertyId: property.id,
      });
    }
  } catch (error) {
    console.error("Error deleting properties:", error);
  }
};
