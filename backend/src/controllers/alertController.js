const addCampaign = async (req, res) => {
  const { name, description, image_url, startDate, endDate, link } = req.body;

  try {
    if (
      !name ||
      !description ||
      !image_url ||
      !startDate ||
      !endDate ||
      !link
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const campaign = await createCampaign({
      name,
      description,
      image_url,
      startDate,
      endDate,
      link,
    });

    res.status(201).json({ campaign });
  } catch (err) {
    res.status(500).json({ error: "Server error", err: err.message });
  }
};

module.exports = {
  addCampaign,
};
