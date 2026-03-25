const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const UserRole = require('../models/UserRoleModel');

// Register User Controller
const register = async (req, res) => {
  const { username, email, password, roleId } = req.body;

  if (req.user.roleId === '1' && req.user.roleId === '2') {
    return res.status(403).json({ message: 'You must be an admin or super admin to register a new user' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
// Update User Controller
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, roleId, password } = req.body;

  try {
    const userToUpdate = await User.findByPk(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Super Admin update restrictions
    if (userToUpdate.roleId === 1 && req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Super Admin details cannot be updated' });
    }

    // Admin cannot update other Admin users
    if (userToUpdate.roleId === 2 && req.user.roleId === 2) {
      return res.status(403).json({ message: 'Admin users cannot update other Admin users' });
    }

    // Update user details
    userToUpdate.username = username || userToUpdate.username;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.roleId = roleId || userToUpdate.roleId;

    // Check if password is provided and update it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;
    }

    await userToUpdate.save();
    res.status(200).json({ message: 'User updated successfully', user: userToUpdate });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};
  
// Delete User Controller
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToDelete = await User.findByPk(id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of Super Admin
    if (userToDelete.roleId === 1) {
      return res.status(403).json({ message: 'Super Admin users cannot be deleted' });
    }

    // Admin cannot delete other Admin users
    if (userToDelete.roleId === 2 && req.user.roleId === 2) {
      return res.status(403).json({ message: 'Admin users cannot delete other Admin users' });
    }

    await userToDelete.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get User by ID Controller
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      include: {
        model: UserRole,
        as: 'role', // Assuming you have an alias for the role association
        attributes: ['roleName'], // Fetch only the roleName
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};

// Get All Users with Pagination Controller
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalUsers, rows: users } = await User.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: {
        model: UserRole,
        as: 'role', // Assuming you have an alias for the role association
        attributes: ['roleName'], // Fetch only the roleName
      },
    });

    res.status(200).json({
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving users', error: error.message });
  }
};


module.exports = { register, updateUser, deleteUser, getUserById, getAllUsers };