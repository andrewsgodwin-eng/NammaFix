export const validateIssueCreation = (req, res, next) => {
  const { category, description, location } = req.body;
  const errors = [];

  const validCategories = [
    'street_light',
    'garbage',
    'pothole',
    'water',
    'drainage',
    'electricity',
    'traffic',
    'other',
  ];

  if (!category || !validCategories.includes(category)) {
    errors.push('A valid issue category is required');
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (description.length > 280) {
    errors.push('Description cannot exceed 280 characters');
  }

  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    errors.push('Valid GPS latitude and longitude coordinates are required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  next();
};
