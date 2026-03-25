const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserManagementModel = require('../models/UsersModel');
const UserTypesModel = require('../models/UserTypesModel');

// Login Controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserManagementModel.findOne({
      where: { email },
      include: [
        {
          model: UserTypesModel,
          as: 'user_types',
          attributes: ['user_type', 'description'],
        },
      ],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign(
      { 
        uid: user.uid, 
        user_type_uid: user.user_type_uid,
        tenant_uid: user.tenant_uid,
        is_superadmin: user.is_superadmin 
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: '24h',
      }
    );

    // Save the token in the database
    user.token = token;
    await user.save();

    // Format the user response
    const formattedUser = {
      uid: user.uid,
      username: user.username,
      email: user.email,
      status: user.status,
      user_type_uid: user.user_type_uid,
      user_type: user.user_types?.user_type || null,
      user_type_description: user.user_types?.description || null,
      group_uid: user.group_uid,
      organization_uid: user.organization_uid,
      tenant_uid: user.tenant_uid,
      branch_uid: user.branch_uid,
      employeeId: user.employeeId,
      is_superadmin: user.is_superadmin,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    res.json({
      message: 'Login successful',
      token,
      user: formattedUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Logout Controller
const logout = async (req, res) => {
  try {
    const userId = req.user?.uid;
    
    if (userId) {
      // Clear token from database
      await UserManagementModel.update(
        { token: null },
        { where: { uid: userId } }
      );
    }

    res.status(200).json({ 
      message: 'User logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Error during logout', 
      error: error.message 
    });
  }
};

module.exports = { login, logout };
