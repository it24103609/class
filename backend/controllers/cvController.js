const CvRegistration = require('../models/CvRegistration');

const createCvRegistration = async (req, res) => {
  try {
    const { name, email, phone, education, experience, skills, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Name, email, and phone are required' });
    }

    const registration = new CvRegistration({
      name,
      email,
      phone,
      education,
      experience,
      skills,
      message,
    });

    const created = await registration.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCvRegistrations = async (req, res) => {
  try {
    const registrations = await CvRegistration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCvRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'contacted', 'completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const registration = await CvRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    registration.status = status;
    const updated = await registration.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCvRegistration = async (req, res) => {
  try {
    const registration = await CvRegistration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.deleteOne();
    res.json({ message: 'Registration removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCvRegistration,
  getAllCvRegistrations,
  updateCvRegistrationStatus,
  deleteCvRegistration,
};
