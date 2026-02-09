import NGO from '../models/NGO.js';
import User from '../models/User.js';

export const registerNGO = async (req, res) => {
  try {
    const {
      organizationName,
      registrationNumber,
      category,
      description,
      website,
      operatingHours
    } = req.body;

    const existingNGO = await NGO.findOne({ registrationNumber });
    if (existingNGO) {
      return res.status(400).json({ error: 'NGO with this registration number already exists' });
    }

    const ngo = new NGO({
      user: req.userId,
      organizationName,
      registrationNumber,
      category,
      description,
      website,
      operatingHours
    });

    await ngo.save();

    res.status(201).json({
      message: 'NGO registered successfully',
      ngo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNGOs = async (req, res) => {
  try {
    const { verified = false } = req.query;

    let query = {};
    if (verified === 'true') {
      query.isVerified = true;
    }

    const ngos = await NGO.find(query).populate('user', 'name email phone address');

    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id).populate('user');

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    if (ngo.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this NGO' });
    }

    Object.assign(ngo, req.body);
    await ngo.save();

    res.status(200).json({
      message: 'NGO updated successfully',
      ngo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      {
        isVerified: true,
        verificationDate: new Date(),
        verifiedBy: req.userId
      },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    res.status(200).json({
      message: 'NGO verified successfully',
      ngo
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.userId }).populate('user');

    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' });
    }

    res.status(200).json(ngo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
