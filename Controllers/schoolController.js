const { db } = require("../Config/database");
const getDistance = require("../utils/cover");

exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;
  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);

  if (!name || !address || Number.isNaN(parsedLatitude) || Number.isNaN(parsedLongitude)) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, address, parsedLatitude, parsedLongitude], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "School added", id: result.insertId });
  });
};

exports.listSchools = (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return res.status(400).json({
      message: "Valid latitude and longitude query params are required",
    });
  }

  db.query("SELECT * FROM schools", (err, schools) => {
    if (err) {
      return res.status(500).json(err);
    }

    const sorted = schools
      .map((school) => ({
        ...school,
        distance: getDistance(
          latitude,
          longitude,
          Number(school.latitude),
          Number(school.longitude)
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
};
