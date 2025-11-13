const User = require('../models/User'); // Adjust the path to your User model
const bcrypt = require('bcryptjs');

module.exports = {
    createUser(req, res) {
        console.log('Preparing to create user with req.body:', req.body);
        // Password hashing is performed in the User model with 'pre' middleware
        const { firstName, lastName, username, email, password, role } = req.body;
        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'First name, last name, username, email, and password are required.',
            });
        }
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            role,
            password, // Password will be hashed in the User model
        });
        newUser.save()
            .then(user => {
                console.log('New user created:', user);
                res.status(200).json({
                    success: true,
                    message: 'User created successfully',
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        studyStartDate: user.studyStartDate,
                        giftType: user.giftType,
                        giftAmount: user.giftAmount,
                        charities: user.charities
                    }
                });
            })
            .catch(err => {
                console.error('Error creating user:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error creating user',
                    error: err.message
                });
            })
    },
    getUsers(req, res) {
        User.find()
            .then(users => {
                res.status(200).json({
                    success: true,
                    users: users.map(user => ({
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        studyStartDate: user.studyStartDate,
                        giftType: user.giftType,
                        giftAmount: user.giftAmount,
                        charities: user.charities,
                        morals: user.morals,
                        journal: user.journal
                    }))
                });
            })
            .catch(err => {
                console.error('Error fetching users:', err);
                res.status(500).json({
                    success: false,
                    message: 'Error fetching users',
                    error: err.message
                });
            });
    },
    async updateUser(req, res) {
        console.log('Updating user with req.user:', req.user);
        try {
            const { username } = req.params; // For admin updates
            const loggedInUserId = req.user?.id; // For self-updates
            const updateData = req.body;

            let query;

            // Scenario 1: Admin is updating a specific user by username.
            if (username) {
                // In a production app, an admin-only middleware would protect this route.
                query = { username: username };
            }
            // Scenario 2: A logged-in user is updating their own profile.
            else if (loggedInUserId) {
                query = { _id: loggedInUserId };
            }
            // Scenario 3: No identifier provided.
            else {
                return res.status(401).json({ success: false, message: 'Unauthorized: No user identifier provided.' });
            }

            // Find the user document first to ensure we can trigger .save() hooks.
            const userToUpdate = await User.findOne(query);

            if (!userToUpdate) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            // If a new password is provided, hash it before updating.
            // Otherwise, remove it from the update data to avoid overwriting the existing hash.
            if (!updateData.password || updateData.password.trim() === '') {
                delete updateData.password;
            }

            // Apply updates to the document and save it. This triggers the pre-save hook for password hashing.
            Object.assign(userToUpdate, updateData);
            const savedUser = await userToUpdate.save();

            // Return a clean user object for security.
            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                user: {
                    id: savedUser._id,
                    firstName: savedUser.firstName,
                    lastName: savedUser.lastName,
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role,
                    charities: savedUser.charities,
                    morals: savedUser.morals,
                    journal: savedUser.journal,
                    studyStartDate: savedUser.studyStartDate,
                }
            });
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json({
                success: false,
                message: 'Error updating user',
                error: err.message
            });
        }
    },

}
