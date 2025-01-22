const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/UserModel');
const Incomes = require('../models/IncomeModel');
const Expenses = require('../models/ExpenseModel');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        const user = new Users({
            name,
            email,
            password,
        });

        await user.save();
        res.status(201).json({ message: 'Đăng ký thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Sai mật khẩu' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Trả về cả user và token
        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                user_id: user._id,
                avatar: user.avatar,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật thông tin người dùng (Tên, Email)
exports.updateUserInfo = async (req, res) => {
    const { user_id, name, email } = req.body;
    console.log(user_id, name, email);
    
    try {
        const user = await Users.findOne({ _id: user_id });
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Cập nhật tên và email
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();
        res.status(200).json({ message: 'Thông tin người dùng đã được cập nhật', user: {
                name: user.name,
                email: user.email,
                user_id: user._id,
                avatar: user.avatar,
            } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng', error });
    }
};

// Cập nhật mật khẩu người dùng
exports.updatePassword = async (req, res) => {
    const { user_id, newPassword } = req.body;

    try {
        const user = await Users.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu', error });
    }
};


// Lấy thông tin tổng hợp tài chính của người dùng
exports.summary_balance = async (req, res) => {
    const { userId } = req.params;
    const { month, year } = req.query; // Lấy month và year từ query params

    try {
        // Lọc danh sách chi tiêu theo tháng và năm
        const expenses = await Expenses.find({
            user_id: userId,
            date: {
                $gte: new Date(year, month - 1, 1), // Ngày đầu tháng
                $lt: new Date(year, month, 1), // Ngày đầu tháng tiếp theo
            },
        });
        const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

        // Lọc danh sách thu nhập theo tháng và năm
        const incomes = await Incomes.find({
            user_id: userId,
            date: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1),
            },
        });
        const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);

        // Tính số dư
        const balance = totalIncome - totalExpense;

        res.json({
            balance,
            totalExpense,
            totalIncome,
            expenses,
            incomes,
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy dữ liệu tài chính", error });
    }
};

