const MobileApp = require('../models/MobileApp');

const getMobileApps = async (req, res) => {
  try {
    const apps = await MobileApp.find({ published: true }).sort({ featured: -1, createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminMobileApps = async (req, res) => {
  try {
    const apps = await MobileApp.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMobileAppById = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Mobile app not found' });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMobileApp = async (req, res) => {
  try {
    const {
      name, description, imageUrl, deployLink, price, originalPrice,
      platform, techStack, reviews, published, featured,
    } = req.body;

    const app = new MobileApp({
      name,
      description,
      imageUrl: imageUrl || '',
      deployLink: deployLink || '',
      price,
      originalPrice,
      platform: platform || 'Android & iOS',
      techStack: techStack || '',
      reviews: reviews || [],
      published: published === true || published === 'true',
      featured: featured === true || featured === 'true',
    });

    const created = await app.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMobileApp = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Mobile app not found' });
    }

    const fields = [
      'name', 'description', 'imageUrl', 'deployLink', 'price',
      'originalPrice', 'platform', 'techStack', 'reviews', 'published', 'featured',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'published' || field === 'featured') {
          app[field] = req.body[field] === true || req.body[field] === 'true';
        } else {
          app[field] = req.body[field];
        }
      }
    });

    const updated = await app.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteMobileApp = async (req, res) => {
  try {
    const app = await MobileApp.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Mobile app not found' });
    }

    await app.deleteOne();
    res.json({ message: 'Mobile app removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMobileApps,
  getAdminMobileApps,
  getMobileAppById,
  createMobileApp,
  updateMobileApp,
  deleteMobileApp,
};
