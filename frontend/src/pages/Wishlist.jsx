const addToWishlist = async (req, res) => {
  try {
    const ad = await AdModel.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    const user = await UserModel.findById(req.user.id);
    if (user.wishlist.includes(req.params.id)) {
      return res.status(400).json({ message: 'Ad already in wishlist' });
    }

    user.wishlist.push(req.params.id);
    await user.save();

    res.status(200).json({ message: 'Added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
      .populate({
        path: 'wishlist',
        populate: { path: 'userId', select: 'name avatar' }
      });
      
    res.status(200).json(user.wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};