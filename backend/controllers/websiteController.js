const Website = require('../models/Website');

const getWebsites = async (req, res) => {
  try {
    const websites = await Website.find({ published: true }).sort({ featured: -1, createdAt: -1 });
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminWebsites = async (req, res) => {
  try {
    const websites = await Website.find().sort({ createdAt: -1 });
    res.json(websites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }
    res.json(website);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createWebsite = async (req, res) => {
  try {
    const {
      name, description, imageUrl, deployLink, price, originalPrice,
      techStack, reviews, published, featured,
    } = req.body;

    const website = new Website({
      name,
      description,
      imageUrl: imageUrl || '',
      deployLink: deployLink || '',
      price,
      originalPrice,
      techStack: techStack || '',
      reviews: reviews || [],
      published: published === true || published === 'true',
      featured: featured === true || featured === 'true',
    });

    const created = await website.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateWebsite = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    const fields = [
      'name', 'description', 'imageUrl', 'deployLink', 'price',
      'originalPrice', 'techStack', 'reviews', 'published', 'featured',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'published' || field === 'featured') {
          website[field] = req.body[field] === true || req.body[field] === 'true';
        } else {
          website[field] = req.body[field];
        }
      }
    });

    const updated = await website.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteWebsite = async (req, res) => {
  try {
    const website = await Website.findById(req.params.id);
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    await website.deleteOne();
    res.json({ message: 'Website removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWebsites,
  getAdminWebsites,
  getWebsiteById,
  createWebsite,
  updateWebsite,
  deleteWebsite,
};
