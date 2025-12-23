const userModel = require('../models/userModel');

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId; // Assuming authMiddleware sets req.user.userId
        const { fullName, phone, address, dob } = req.body;

        // Map frontend camelCase to model expected format if needed
        // The model expects object with full_name, etc. or we pass explicit params.
        // My update model takes (userId, { full_name, phone, address, birth_date })

        const updateData = {
            full_name: fullName,
            phone: phone,
            address: address,
            birth_date: dob
        };

        const updatedUser = await userModel.update(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.user_id,
                fullName: updatedUser.full_name,
                email: updatedUser.email,
                phone: updatedUser.phone_number,
                address: updatedUser.address,
                dob: updatedUser.birth_date,
                avatarUrl: updatedUser.avatar_url
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error during profile update' });
    }
};
