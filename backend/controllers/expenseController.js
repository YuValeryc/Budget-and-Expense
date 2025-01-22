const Expenses = require("../models/ExpenseModel");

// [GET] expense theo tháng và năm
const showExpenses = async (req, res) => {
  try {
    const { user_id, month, year } = req.body; // Nhận thêm tháng và năm từ client

    // Tạo bộ lọc theo tháng và năm nếu có
    const filter = { user_id };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
      const endDate = new Date(year, month, 0); // Ngày cuối tháng
      filter.date = { $gte: startDate, $lte: endDate }; // Lọc theo khoảng thời gian
    }

    const expenses = await Expenses.find(filter).sort({ date: -1 }); // Lấy chi tiêu theo tháng/năm, sắp xếp mới nhất trước

    // Tính tổng chi tiêu
    const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);

    // Trả về dữ liệu
    res.status(200).json({
      expenses: expenses.map(expense => ({
        _id: expense._id,
        source: expense.source,
        amount: expense.amount,
        category: expense.category,
        date: income.date,
        description: expense.description || "",
        createdAt: expense.createdAt,
      })),
      totalExpense,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses", error: err.message });
  }
};

// [POST] expense
const addExpense = async (req, res) => {
  try {
    console.log(req.body);

    const { source, amount, description, category, user_id } = req.body;
    const newExpense = new Expenses({
      source,
      amount,
      description,
      category,
      user_id,
    });
    await newExpense.save();
    res.status(201).json({ message: 'Thêm chi tiêu thành công', expense: newExpense });
  } catch (error) {
    console.error("Error in addExpense:", error);
    res.status(400).json({ error: 'Lỗi khi thêm chi tiêu' });
  }
};

// Xóa chi tiêu
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expenses.findOneAndDelete({ _id: id, user_id: req.body.user_id });

    if (!deletedExpense) {
      return res.status(404).json({ error: 'Chi tiêu không tồn tại hoặc bạn không có quyền xóa' });
    }

    res.status(200).json({ message: 'Xóa chi tiêu thành công', expense: deletedExpense });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa chi tiêu' });
  }
};

module.exports = {
  showExpenses,
  addExpense,
  deleteExpense,
};
