const db = require('../database/postgres-connection');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * PostgreSQL User Controller
 * Converted from MongoDB/Mongoose to PostgreSQL
 */

module.exports = {
  /**
   * Create a new user
   */
  async createUser(req, res) {
    console.log('Preparing to create user with req.body:', req.body);

    try {
      const { firstName, lastName, username, email, password, role, studyStartDate } = req.body;

      // Validation
      if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'First name, last name, username, email, and password are required.',
        });
      }

      // Check if username already exists
      const existingUser = await db.query(
        'SELECT id FROM users WHERE username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Username already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Insert new user
      const result = await db.query(`
        INSERT INTO users (
          first_name, last_name, username, email, password, role,
          study_start_date, charities, morals, journal, history
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id, first_name, last_name, username, email, role,
                  study_start_date, gift_type, gift_amount, charities,
                  created_at, updated_at`
        , [
        firstName,
        lastName,
        username,
        email,
        hashedPassword,
        role || 'user',
        studyStartDate || null, // Include studyStartDate from request
        JSON.stringify([]), // charities as empty array
        JSON.stringify([]), // morals as empty array
        JSON.stringify([]), // journal as empty array
        JSON.stringify([])  // history as empty array
      ]);

      const newUser = result.rows[0];
      console.log('New user created:', newUser);

      res.status(200).json({
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          studyStartDate: newUser.study_start_date,
          giftType: newUser.gift_type,
          giftAmount: newUser.gift_amount,
          charities: newUser.charities
        }
      });

    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({
        success: false,
        message: 'Error creating user',
        error: err.message
      });
    }
  },

  /**
   * Get all users
   */
  async getUsers(req, res) {
    try {
      const result = await db.query(`
        SELECT id, first_name, last_name, username, email, role,
               study_start_date, gift_type, gift_amount, charities,
               morals, journal, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
      `);

      const users = result.rows.map(user => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        email: user.email,
        role: user.role,
        studyStartDate: user.study_start_date,
        giftType: user.gift_type,
        giftAmount: user.gift_amount,
        charities: user.charities,
        morals: user.morals,
        journal: user.journal
      }));

      res.status(200).json({
        success: true,
        users: users
      });

    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({
        success: false,
        message: 'Error fetching users',
        error: err.message
      });
    }
  },

  /**
   * Update user (by username for admin, by ID for self-update)
   */
  async updateUser(req, res) {
    console.log('Updating user with req.user:', req.user);

    try {
      const { username } = req.params; // For admin updates
      const loggedInUserId = req.user?.id; // For self-updates
      const updateData = req.body;

      let query;
      let params;

      // Scenario 1: Admin is updating a specific user by username
      if (username) {
        query = 'SELECT * FROM users WHERE username = $1';
        params = [username];
      }
      // Scenario 2: A logged-in user is updating their own profile
      else if (loggedInUserId) {
        query = 'SELECT * FROM users WHERE id = $1';
        params = [loggedInUserId];
      }
      // Scenario 3: No identifier provided
      else {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: No user identifier provided.'
        });
      }

      // Find the user first
      const userResult = await db.query(query, params);

      if (userResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const existingUser = userResult.rows[0];

      // Prepare update fields
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;

      // Hash password if provided and not empty
      if (updateData.password && updateData.password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(updateData.password, SALT_ROUNDS);
        updateFields.push(`password = $${paramCount}`);
        updateValues.push(hashedPassword);
        paramCount++;
      }

      // Handle other fields
      const fieldMapping = {
        firstName: 'first_name',
        lastName: 'last_name',
        email: 'email',
        role: 'role',
        giftType: 'gift_type',
        giftAmount: 'gift_amount',
        studyStartDate: 'study_start_date'
      };

      Object.keys(fieldMapping).forEach(key => {
        if (updateData[key] !== undefined) {
          updateFields.push(`${fieldMapping[key]} = $${paramCount}`);
          updateValues.push(updateData[key]);
          paramCount++;
        }
      });

      // Handle JSON fields
      const jsonFields = ['charities', 'morals', 'journal', 'history'];
      jsonFields.forEach(field => {
        if (updateData[field] !== undefined) {
          updateFields.push(`${field} = $${paramCount}`);
          updateValues.push(JSON.stringify(updateData[field]));
          paramCount++;
        }
      });

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid fields to update'
        });
      }

      // Add user identifier to the end
      updateValues.push(username ? username : loggedInUserId);
      const whereClause = username ? 'username = $' + paramCount : 'id = $' + paramCount;

      // Perform update
      const updateQuery = `
        UPDATE users
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE ${whereClause}
        RETURNING id, first_name, last_name, username, email, role,
                  charities, morals, journal, study_start_date,
                  gift_type, gift_amount, created_at, updated_at
      `;

      const result = await db.query(updateQuery, updateValues);
      const updatedUser = result.rows[0];

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role,
          charities: updatedUser.charities,
          morals: updatedUser.morals,
          journal: updatedUser.journal,
          studyStartDate: updatedUser.study_start_date,
          giftType: updatedUser.gift_type,
          giftAmount: updatedUser.gift_amount
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

  /**
   * Get user by username or ID
   */
  async getUser(req, res) {
    try {
      const { username, id } = req.params;

      let query, params;
      if (username) {
        query = 'SELECT * FROM users WHERE username = $1';
        params = [username];
      } else if (id) {
        query = 'SELECT * FROM users WHERE id = $1';
        params = [id];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Username or ID is required'
        });
      }

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const user = result.rows[0];
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          email: user.email,
          role: user.role,
          charities: user.charities,
          morals: user.morals,
          journal: user.journal,
          studyStartDate: user.study_start_date,
          giftType: user.gift_type,
          giftAmount: user.gift_amount
        }
      });

    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({
        success: false,
        message: 'Error fetching user',
        error: err.message
      });
    }
  },

  /**
   * Delete user
   */
  async deleteUser(req, res) {
    try {
      const { username, id } = req.params;

      let query, params;
      if (username) {
        query = 'DELETE FROM users WHERE username = $1 RETURNING id';
        params = [username];
      } else if (id) {
        query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        params = [id];
      } else {
        return res.status(400).json({
          success: false,
          message: 'Username or ID is required'
        });
      }

      const result = await db.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({
        success: false,
        message: 'Error deleting user',
        error: err.message
      });
    }
  },

  /**
   * Authenticate user (for login)
   */
  async authenticateUser(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Username and password are required'
        });
      }

      // Find user by username
      const result = await db.query(
        'SELECT id, username, password, role, first_name, last_name, email FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const user = result.rows[0];

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Return user without password
      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email
        }
      });

    } catch (err) {
      console.error('Error authenticating user:', err);
      res.status(500).json({
        success: false,
        message: 'Error authenticating user',
        error: err.message
      });
    }
  }
};
