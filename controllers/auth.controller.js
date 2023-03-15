const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config");
const response = require("../helpers/response.helper");
const db = require("../models");
const Admin = db.admin;

generateLoginData = (admin) => {
  const token = jwt.sign(
    {
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
    },
    config.secret,
    {
      expiresIn: 2592000, // 30 days
    }
  );

  var data = {
    accessToken: token,
  };
  return data;
};

exports.addAdmin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (
    email == null ||
    email === "" ||
    password == null ||
    password === ""
  ) {
    return response.responseHelper(
      res,
      false,
      "All fields are required",
      "Failed to Add Admin"
    );
  }

  if (password.length < 8) {
    return response.responseHelper(
      res,
      false,
      "Password Length should be larger than of equal to 8",
      "Failed to Add Admin"
    );
  }

  try {
    let result = await Admin.findOne({
      where: {
        email: email,
      },
    });
    if (result) {
      return response.responseHelper(
        res,
        false,
        "This Email is already in use, register with a new email",
        "Failed to Add Admin"
      );
    } else {
      let admin = await Admin.create({
        email,
        password: bcrypt.hashSync(password, 10),
      });
      if (admin) {
        return response.responseHelper(
          res,
          true,
          {
            admin: admin,
            token: generateLoginData(admin),
          },
          "Sign Up successful"
        );
      }
    }
  } catch (error) {
    console.log(error);
    return response.responseHelper(res, false, "Error", "Something went wrong");
  }
};

exports.loginAdmin = async (req, res) => {
  let email = req.body.email;
  const password = req.body.password;

  if (email == null || email === "" || password == null || password === "") {
    return response.responseHelper(
      res,
      false,
      "All fields required",
      "Login failed"
    );
  }

  try {
    var admin = await Admin.findOne({
      where: {
        email: email,
      },
    });

    if (!email) {
      return response.responseHelper(
        res,
        false,
        "Invalid Email",
        "Login failed"
      );
    }

    const passwordIsValid = bcrypt.compareSync(password, admin.password);

    if (!passwordIsValid) {
      return response.responseHelper(
        res,
        false,
        "Wrong Password",
        "Login failed"
      );
    }
    return response.responseHelper(
      res,
      true,
      {
        admin: admin,
        token: generateLoginData(admin),
      },
      "Login successful"
    );
  } catch (err) {
    console.log(err.message);
    return response.responseHelper(
      res,
      false,
      "Something went wrong",
      "Login failed"
    );
  }
};

exports.getAdmins = async (req, res) => {
  try {
    var admins = await Admin.findAll();

    return response.responseHelper(
      res,
      true,
      {
        admins: admins,
      },
      "Admins found"
    );
  } catch (err) {
    console.log(err.message);
    return response.responseHelper(
      res,
      false,
      "Something went wrong",
      "Request failed"
    );
  }
};
