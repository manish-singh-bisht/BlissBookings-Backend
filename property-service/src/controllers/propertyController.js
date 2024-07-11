const { validationResult, matchedData } = require("express-validator");
const prisma = require("../lib/prisma");
const { sendMessage } = require("../kafka/producer");

exports.createProperty = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const {
    name,
    per_night_price,
    description,
    hostId,
    guests_num,
    bed_num,
    bedroom_num,
    bathroom_num,
    address_line_1,
    address_line_2,
    locationId,
    propertyTypeId,
  } = matchedData(req);

  try {
    const property = await prisma.property.create({
      data: {
        name,
        per_night_price,
        description,
        hostId,
        guests_num,
        bed_num,
        bedroom_num,
        bathroom_num,
        address_line_1,
        address_line_2,
        locationId,
        propertyTypeId,
      },
    });

    res.status(201).json({ property });
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ error: "Failed to create property" });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        location: true,
        propertyType: true,
      },
    });
    res.status(200).json({ properties });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

exports.getPropertyById = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { id } = matchedData(req);

  try {
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        location: true,
        propertyType: true,
      },
    });

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ property });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ error: "Failed to fetch property" });
  }
};

exports.updateProperty = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const {
    id,
    name,
    per_night_price,
    description,
    hostId,
    guests_num,
    bed_num,
    bedroom_num,
    bathroom_num,
    address_line_1,
    address_line_2,
    locationId,
    propertyTypeId,
  } = matchedData(req);

  try {
    const property = await prisma.property.update({
      where: { id },
      data: {
        name,
        per_night_price,
        description,
        hostId,
        guests_num,
        bed_num,
        bedroom_num,
        bathroom_num,
        address_line_1,
        address_line_2,
        locationId,
        propertyTypeId,
      },
    });

    res.status(200).json({ property });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({ error: "Failed to update property" });
  }
};

exports.deleteProperty = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const { id } = matchedData(req);

  try {
    await prisma.property.delete({
      where: { id },
    });
    await sendMessage("property-topic", {
      event: "delete-property",
      propertyId: id,
    });
    return res.status(204).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ error: "Failed to delete property" });
  }
};
