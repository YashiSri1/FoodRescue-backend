import User from '../models/User.js';
import { generateToken } from '../utils/helpers.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, address, location } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
      phone,
      address,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      }
    });

    await user.save();

    const token = generateToken(user._id, user.role);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatched = await user.matchPassword(password);
    if (!isMatched) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('ratings');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, bio, location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        phone,
        address,
        bio,
        ...(location && {
          location: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude]
          }
        })
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const host = `${req.protocol}://${req.get('host')}`;
    const imageUrl = `${host}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: imageUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile image updated',
      user
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNearbyUsers = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5 } = req.query;

    const users = await User.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
