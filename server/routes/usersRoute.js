const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const userModel = require('../models/userModel');
const examModel = require('../models/examModel');

// user registration

router.post("/register", async (req, res) => {
  try {
    // check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // create new user
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// user login

router.post("/login", async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }

    // check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res
        .status(200)
        .send({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

// get user info

router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.send({
      message: "User info fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.post("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find({});
    res.send({
      message: "Users fetched successfully",
      data: users,
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: error,
      success: false,
    });
  }
});

router.put('/:id/edit', async (req, res) => {
  try {
    const { isAdmin } = req.body; // Get the new isAdmin status from the request body
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isAdmin = isAdmin;
    await user.save();
    
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


router.put('/promote-to-admin', async (req, res) => {
  try {
    const { email, examName } = req.body;

    if (!email || !examName) {
      return res.status(400).json({ success: false, message: 'Email and exam name are required' });
    }

    // Check if the exam exists
    const exam = await examModel.findOne({ name: examName });
    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam not found' });
    }

    // Find the user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Promote the user to admin and assign the exam
    user.isAdmin = true;
    user.assignedExam = examName;

    await user.save();

    res.status(200).json({ success: true, message: `User promoted to admin with access to ${examName} exam` });
  } catch (error) {
    console.error('Error in promoting user to admin:', error);
    res.status(500).json({ success: false, message: 'Error promoting user to admin', error });
  }
});

// Restrict access to the assigned exam
router.get('/admin/exams/edit/:examName', async (req, res) => {
  try {
    const { examName } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and user ID is available

    // Find the user by their ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user is admin and has access to the specific exam by name
    if (user.isAdmin && user.assignedExam.toLowerCase() === examName.toLowerCase()) {
      // If the user has access to this exam, find the exam in the database
      const exam = await examModel.findOne({ name: examName });
      if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
      }

      // If the exam exists and the user has access, return it
      return res.status(200).json({ success: true, exam });
    } else {
      // User does not have access to this exam
      return res.status(403).json({ success: false, message: 'You do not have access to this exam' });
    }
  } catch (error) {
    console.error('Error fetching exam:', error);
    return res.status(500).json({ success: false, message: 'Error fetching exam', error });
  }
 
});



module.exports = router;


