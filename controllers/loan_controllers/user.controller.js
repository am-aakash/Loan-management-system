const { v4: uuidv4 } = require("uuid");
const response = require("../../helpers/response.helper");
const db = require("../../models");
const getCreditScore = require("./loan_utils/credit_score")
const User = db.user;

exports.registerUser = async (req, res) => {
    const aadhar_id = req.body.aadhar_id;
    const name = req.body.name;
    const email = req.body.email;
    const annual_income = req.body.annual_income;

    if (
        email == null ||
        email === "" ||
        aadhar_id == null ||
        aadhar_id === "" ||
        name == null ||
        name === "" ||
        annual_income == null ||
        annual_income === ""
    ) {
        return response.responseHelper(
            res,
            false,
            "All fields are required",
            "Failed to Register User"
        );
    }

    try {
        let result = await User.findOne({
            where: {
                aadhar_id: aadhar_id,
            },
        });
        if (result) {
            return response.responseHelper(
                res,
                false,
                "This User is already registered",
                "Failed to Register User"
            );
        } else {
            let credit_score = getCreditScore(aadhar_id);
            let user = await User.create({
                aadhar_id,
                name,
                email,
                annual_income,
                credit_score,
            });
            if (user) {
                return response.responseHelper(
                    res,
                    true,
                    user,
                    "Register user successful"
                );
            }
        }
    } catch (error) {
        console.log(error);
        return response.responseHelper(res, false, "Error", "Something went wrong");
    }
};

exports.getUsers = async (req, res) => {
    try {
        var users = await User.findAll();

        return response.responseHelper(
            res,
            true,
            {
                users: users,
            },
            "users found"
        );
    } catch (err) {
        console.log(err.message);
        return response.responseHelper(
            res,
            false,
            "Something went wrong",
            "Get users failed"
        );
    }
};
