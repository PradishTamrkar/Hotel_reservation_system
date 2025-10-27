const {
    createAdmin,
    loginAdmin,
    getAllAdmins,
    getAdminByID,
    updateAdmin,
    deleteAdmin
} = require("../service/adminService");

// create admin
const handleCreateAdmin = async (req, res) => {
    try {
        const admin = await createAdmin(req.body);
        res.status(201).json({ message: "Admin registration successful", admin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// admin login
const handleAdminLogin = async (req, res) => {
    try {
        const result = await loginAdmin(req.body);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// get all admin
const handleGetAllAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get single admin
const handleGetAdminByID = async (req, res) => {
    try {
        const admin = await getAdminByID(req.params.id);
        res.json(admin);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

// update admin
const handleUpdateAdmin = async (req, res) => {
    try {
        const admin = await updateAdmin(req.params.id, req.body);
        res.json(admin);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// delete admin
const handleDeleteAdmin = async (req, res) => {
    try {
        const message = await deleteAdmin(req.params.id);
        res.json({ message });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    handleCreateAdmin,
    handleAdminLogin,
    handleGetAllAdmins,
    handleGetAdminByID,
    handleUpdateAdmin,
    handleDeleteAdmin
};
