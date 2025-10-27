const Admin = require("../models/admin");
const { generateToken } = require("../middlewares/auth");
const { hashedPass, compPass } = require("../service/passwordService");

// create admin
const createAdmin = async (data) => {
    const { admin_username, admin_email, admin_password, contact_no } = data;
    const hashedPassword = await hashedPass(admin_password);
    const admin = await Admin.create({
        admin_username,
        admin_email,
        admin_password: hashedPassword,
        contact_no
    });
    return admin;
};

// admin login
const loginAdmin = async (data) => {
    const { admin_username, admin_password } = data;
    const admin = await Admin.findOne({ where: { admin_username } });

    if (!admin) throw new Error("Not Admin. Access Denied");

    const validPassword = await compPass(admin_password, admin.admin_password);
    if (!validPassword) throw new Error("Password not matched");

    const token = generateToken({ id: admin.admin_id, role: "admin" });
    return { message: "Login Successful", token };
};

// get all admin
const getAllAdmins = async () => {
    const admins = await Admin.findAll();
    return admins;
};

// get single admin
const getAdminByID = async (id) => {
    const admin = await Admin.findByPk(id);
    if (!admin) throw new Error("Admin not found");
    return admin;
};

// update admin
const updateAdmin = async (id, data) => {
    const admin = await Admin.findByPk(id);
    if (!admin) throw new Error("Admin not found");

    await admin.update(data);
    return admin;
};

// delete admin
const deleteAdmin = async (id) => {
    const admin = await Admin.findByPk(id);
    if (!admin) throw new Error("Admin not found");

    await admin.destroy();
    return "Admin deleted successfully";
};

module.exports = {
    createAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminByID,
    updateAdmin,
    deleteAdmin
};
