const { v4: uuidv4 } = require("uuid");
const pool = require("../../Database/db");
const query = require("../../queries");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "dsklajksd12323jsaldj";
const saltRounds = 10;

const addUser = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Check if the email already exists
    const result = await pool.query(query.findUser, [email]);

    if (result.rows.length !== 0) {
      console.log("hi i am here");
      return res.json({
        status: "failed",
        code: 400,
        message: "Email already in use",
        token: "",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const id = uuidv4();
    console.log("The id is " + id);
    console.log("The pwd is " + hashedPassword);

    // Add the user with the hashed password
    await pool.query(query.addUser, [email, hashedPassword, username, id]);

    return res.json({
      status: "success",
      code: 200,
      message: "User added successfully",
      token: "",
      id
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "failed",
      code: 500,
      message: "Internal server error",
      token: "",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log("email: ", email);

  try {
    // Fetch user from the database
    const result = await pool.query(query.findUser, [email]);

    if (result.rows.length === 0) {
      return res.json({
        status: "failed",
        code: 400,
        message: "Invalid Email or Password",
        token: "",
      });
    }

    // Compare the provided password with the hashed password in the database
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({
        status: "failed",
        code: 400,
        message: "Invalid Email or Password",
        token: "",
      });
    }

    console.log("This is the user " + JSON.stringify(user));
    console.log("This is the userName " + user.username);

    // Generate a token
    const token = jwt.sign({ email: email }, SECRET_KEY, { expiresIn: "1h" }); // Adjust token expiration as needed

    return res.json({
      status: "success",
      code: 200,
      message: "Login successful",
      token,
      id:user.id,
      username : user.username
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      status: "failed",
      code: 500,
      message: "Internal server error",
      token: "",
    });
  }
};

module.exports = { addUser, loginUser };
