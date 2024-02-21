const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { order } = require('../schemas/userSchema');
const userSchema = require('../schemas/userSchema');
const categorySchema = require('../schemas/categorySchema');
const subcategorySchema = require('../schemas/subcategorySchema');
const commentSchema = require('../schemas/commentSchema');
const messageSchema = require('../schemas/messageSchema');

const resSend = require('../plugins/resSend');
const nodemailer = require('nodemailer');

exports.login = async (req, res) => {
  const { email, password1 } = req.body;
  try {
    const existingUser = await userSchema.findOne({ email });

    if (!existingUser) {
      return resSend(res, false, null, 'Invalid user email or password.');
    }

    if (!existingUser.isActive) {
      return resSend(
        res,
        false,
        null,
        'The user is not activated. Please enter the activation code.'
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password1,
      existingUser.password
    );
    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          email: existingUser.email,
          username: existingUser.username,
          role: existingUser.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '12h',
        }
      );

      return resSend(
        res,
        true,
        {
          token,
          email,
          username: existingUser.username,
          imgURL: existingUser.imgURL,
        },
        'Login successful.'
      );
    } else {
      return resSend(res, false, null, 'Invalid user email or password.');
    }
  } catch (error) {
    console.log('Login error:', error);
    return resSend(res, false, null, 'Login error.');
  }
};

exports.register = async (req, res) => {
  const { username, email, password1, role } = req.body;

  try {
    const existingUsername = await userSchema.findOne({ username });

    if (existingUsername) {
      return resSend(res, false, null, 'Username is already taken.');
    }
    const existingEmail = await userSchema.findOne({ email });

    if (existingEmail) {
      return resSend(res, false, null, 'Email address is already taken.');
    }

    const hashedPassword = await bcrypt.hash(password1, 10);
    const activationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = new userSchema({
      username,
      email,
      password: hashedPassword,
      role,
      emailActivation: activationCode,
      isActive: false,
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'Artiform team - auth',
      to: email,
      subject: 'Your activation code is here!',
      text: `Your activation code is: ${activationCode}. Happy chatting!`,
    };

    try {
      await transporter.sendMail(mailOptions);
      resSend(
        res,
        true,
        null,
        'Registration successful. Please check your email for the activation code.'
      );
    } catch (emailError) {
      console.error('Error sending activation email:', emailError);
      resSend(res, false, null, 'Error sending activation email.');
    }
  } catch (error) {
    console.error('Internal server error:', error);
    resSend(res, false, null, 'Internal server error.');
  }
};

exports.verifyActivationCode = async (req, res) => {
  const { email, activationCode } = req.body;

  try {
    const user = await userSchema.findOne({
      email,
      emailActivation: activationCode.trim(),
    });
    if (!user) {
      return resSend(res, false, null, 'Invalid code or user.');
    }

    user.isActive = true;
    user.emailActivation = '';
    await user.save();

    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '12h',
      }
    );

    resSend(
      res,
      true,
      { token, email: user.email },
      'User successfully activated.'
    );
  } catch (error) {
    resSend(res, false, null, 'Error checking the activation code.');
  }
};

exports.getUser = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userSchema.findOne({ email: decoded.email });
    if (!user) {
      return resSend(res, false, null, 'User is not found.');
    }

    return resSend(res, true, { email: user.email }, 'User data is received.');
  } catch (error) {
    return resSend(res, false, null, 'Invalid token.');
  }
};

// CATEGORIES

exports.getCategories = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const categories = await categorySchema.find().populate('subcategories');

    return resSend(res, true, categories, 'Returning all categories.');
  } catch (error) {
    return resSend(res, false, null, 'Retrieving categories failed.');
  }
};

exports.createCategory = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const newCategory = new categorySchema({
      title: req.body.categoryTitle,
    });

    await newCategory.save();

    return resSend(res, true, null, 'Created new category.');
  } catch (error) {
    return resSend(res, false, null, 'Creating a new category failed.');
  }
};

exports.getCategorywithSubcategoriesByTitle = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const categories = await categorySchema
      .findOne({ title: req.params.title })
      .populate({ path: 'subcategories', populate: { path: 'comments' } });

    return resSend(res, true, categories, 'Retrieving category by title.');
  } catch (error) {
    return resSend(res, false, null, 'Retrieving category by title failed.');
  }
};

// SUB-CATEGORIES

exports.createSubcategory = async (req, res) => {
  const token = req.headers.authorization;
  const categoryTitle = req.params.categoryTitle;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const existingUser = await userSchema.findOne({ email: decoded.email });

    const newSubcategory = new subcategorySchema({
      title: req.body.subcategoryTitle,
      description: req.body.subcategoryDescription,
      user: existingUser._id,
    });

    await newSubcategory.save();

    const category = await categorySchema.findOne({ title: categoryTitle });

    await addSubcategoryToCategory(category, newSubcategory);

    return resSend(res, true, null, 'Created new subcategory.');
  } catch (error) {
    return resSend(res, false, null, 'Creating a new subcategory failed.');
  }
};

exports.getSubcategoryById = async (req, res) => {
  const token = req.headers.authorization;
  const subcategoryId = req.params.id;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const subcategory = await subcategorySchema
      .findOne({ _id: subcategoryId })
      .populate('user')
      .populate({ path: 'comments', populate: { path: 'user' } });

    return resSend(res, true, subcategory, 'Subcategory by ID returned.');
  } catch (error) {
    return resSend(res, false, null, 'Failed to retrieve subcategory by ID.');
  }
};

//

const addSubcategoryToCategory = function (categoryId, subcategory) {
  return categorySchema.findByIdAndUpdate(
    categoryId,
    { $push: { subcategories: subcategory._id } },
    { new: true, useFindAndModify: false }
  );
};

const addCommentToSubcategory = function (subcategoryId, comment) {
  return subcategorySchema.findByIdAndUpdate(
    subcategoryId,
    { $push: { comments: comment._id } },
    { new: true, useFindAndModify: false }
  );
};

// COMMENTS

exports.createComment = async (req, res) => {
  const token = req.headers.authorization;
  const { text, url } = req.body;
  const subcategoryId = req.params.subcategoryId;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const existingUser = await userSchema.findOne({ email: decoded.email });

    const newComment = new commentSchema({
      text: text,
      url: url,
      user: existingUser._id,
      subcategory: subcategoryId,
    });
    await addCommentToSubcategory(subcategoryId, newComment);

    await newComment.save();

    return resSend(res, true, null, 'Created new comment.');
  } catch (error) {
    return resSend(res, false, null, 'Creating a new comment failed.');
  }
};

exports.getCommentsBySubcategoryId = async (req, res) => {
  const token = req.headers.authorization;
  const id = req.params.id;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const comments = await commentSchema
      .find({ subcategory: id })
      .populate('user');

    return resSend(res, true, comments, 'Successfully retuned comments.');
  } catch (error) {
    return resSend(res, false, null, 'Returning comments failed.');
  }
};

//  PROFILE

exports.getCurrentUser = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const currentUser = await userSchema.findOne({ email: decoded.email });

    const subcategories = await subcategorySchema.find({
      user: currentUser._id,
    });

    const comments = await commentSchema.find({ user: currentUser._id });

    return resSend(
      res,
      true,
      { currentUser, subcategories, comments },
      'Retrieved current user successfully.'
    );
  } catch (error) {
    return resSend(res, false, null, 'Retrieving user failed.');
  }
};

exports.updateImage = async (req, res) => {
  const token = req.headers.authorization;
  const userId = req.params.userId;
  const imgURL = req.body.imgURL;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }

  try {
    const currentUser = await userSchema.findOneAndUpdate(
      { _id: userId },
      { $set: { imgURL: imgURL } },
      { new: true }
    );

    return resSend(
      res,
      true,
      currentUser,
      'Profile image updated successfully.'
    );
  } catch (error) {
    return resSend(res, false, null, 'Update of profile image failed.');
  }
};

//  CHAT

exports.sendPrivateMessage = async (req, res) => {
  const token = req.headers.authorization;
  const userId = req.params.userId;
  const message = req.body.message;
  console.log(message, userId);
  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const currentUser = await userSchema.findOne({ email: decoded.email });

    const comment = new messageSchema({
      text: message,

      sender: currentUser._id,
      receiver: userId,
    });

    await comment.save();

    return resSend(res, true, null, 'Message created successfully.');
  } catch (error) {
    return resSend(res, false, null, 'Message creation failed.');
  }
};

exports.getCurrentUsersChats = async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const currentUser = await userSchema.findOne({
      email: decoded.email,
    });

    const messages = await messageSchema.find({
      $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    });

    const messagesUsers = [];
    messages.map((x) => {
      if (x.sender.equals(currentUser._id)) {
        if (
          !messagesUsers.some((v) => {
            return x.receiver.equals(v);
          }) &&
          !x.receiver.equals(currentUser._id)
        ) {
          messagesUsers.push(x.receiver);
        }
      } else if (x.receiver.equals(currentUser._id)) {
        if (
          !messagesUsers.some((v) => {
            return x.sender.equals(v);
          }) &&
          !x.sender.equals(currentUser._id)
        ) {
          messagesUsers.push(x.sender);
        }
      }
    });

    const messageUserFilter = [];

    messagesUsers.map((x) => {
      messageUserFilter.push({ _id: x });
    });

    const messagedUsers = await userSchema.find({
      $or: [...messageUserFilter],
    });
    const result = messagedUsers.map((x) => {
      const singleUserMessages = [];
      let unreadMessages = 0;
      messages.map((m) => {
        if (m.sender.equals(x._id) || m.receiver.equals(x._id)) {
          singleUserMessages.push(m);

          console.log(`this is ${m._id} and  ${m.messageRead}`);
          if (!m.messageRead && m.receiver.equals(currentUser._id)) {
            unreadMessages++;
            console.log(`im in messages count: ${unreadMessages}`);
          }
        }
      });

      return {
        username: x.username,
        userId: x._id,
        messages: singleUserMessages,
        unreadMessagesCount: unreadMessages,
      };
    });
    return resSend(res, true, result, 'Message created successfully.');
  } catch (error) {
    return resSend(res, false, null, 'Message creation failed.');
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const token = req.headers.authorization;
  const sender = req.body.sender;

  if (!token) {
    return resSend(res, false, null, 'Valid token not found.');
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  try {
    const currentUser = await userSchema.findOne({ email: decoded.email });

    const messages = await messageSchema.find({
      $and: [{ sender: sender }, { receiver: currentUser._id }],
    });

    await messageSchema.updateMany(
      { sender: sender, receiver: currentUser._id },
      { $set: { messageRead: 'true' } }
    );

    return resSend(res, true, null, 'Message created successfully.');
  } catch (error) {
    return resSend(res, false, null, 'Message creation failed.');
  }
};

// PASSWORD RESET

exports.sendCode = async (req, res) => {
  const { email } = req.body;

  const validEmail = await userSchema.findOne({ email });
  if (!validEmail)
    return resSend(
      res,
      false,
      null,
      'The user with the provided email address does not exist.'
    );

  try {
    function generateCode() {
      return Math.floor(1000000 + Math.random() * 9000000);
    }
    const code = generateCode();

    await userSchema.findOneAndUpdate(
      { email },
      { $set: { emailActivation: code } }
    );

    const message = `Your recovery code: ${code}`;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: false,
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: 'final_project auth',
      to: email,
      subject: 'Your Recovery Code',
      text: message,
    };

    await transporter.sendMail(mailOptions);

    resSend(res, true, null, 'success');
  } catch (error) {
    resSend(res, false, null, 'error');
  }
};

exports.validateResetCode = async (req, res) => {
  const { email, code } = req.body;
  let user;
  try {
    user = await userSchema.findOne({ email, emailActivation: code });
    if (user) {
      resSend(res, true, null, 'success');
    } else {
      resSend(res, false, null, 'Invalid code.');
    }
  } catch (e) {
    resSend(res, false, null, 'Server error.');
  }
};

exports.changePassword = async (req, res) => {
  const { email, password1, password2, code } = req.body;
  let user;
  try {
    user = await userSchema.findOne({ email, emailActivation: code });
  } catch (e) {
    resSend(res, false, null, 'An error occurred.');
  }
  const hashedPassword = await bcrypt.hash(password1, 10);
  try {
    await userSchema.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } }
    );
  } catch (e) {
    resSend(res, false, null, 'An error occurred.');
  }

  resSend(res, true, null, 'success');
};

// Auto Login

exports.autoLogin = async (req, res) => {
  const { token } = req.body;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const { email, username } = decodedToken;
  try {
    res
      .status(200)
      .json({ message: 'success', email: email, username: username });
  } catch {
    res.status(500).json({ message: 'An error occurred.' });
  }
};
