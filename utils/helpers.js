import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const calculateDistance = (coords1, coords2) => {
  const R = 6371; // Radius of the Earth in km
  const lat1 = (coords1[1] * Math.PI) / 180;
  const lat2 = (coords2[1] * Math.PI) / 180;
  const deltaLat = ((coords2[1] - coords1[1]) * Math.PI) / 180;
  const deltaLng = ((coords2[0] - coords1[0]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
