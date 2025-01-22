const Incomes = require("../models/IncomeModel");

//[GET] income
const showIncomes = async (req, res) => {
  try {
    const { user_id, month, year } = req.body; // Nhận thêm tháng và năm từ client
    
    // Tạo bộ lọc theo tháng và năm nếu có
    const filter = { user_id };
    if (month && year) {
      const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
      const endDate = new Date(year, month, 0); // Ngày cuối tháng
      filter.date = { $gte: startDate, $lte: endDate }; // Lọc theo khoảng thời gian
    }

    const incomes = await Incomes.find(filter).sort({ date: -1 }); // Lấy thu nhập theo tháng/năm, sắp xếp mới nhất trước

    // Tính tổng thu nhập
    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

    // Trả về dữ liệu
    res.status(200).json({
      incomes: incomes.map(income => ({
        _id: income._id,
        source: income.source,
        amount: income.amount,
        category: income.category,
        date: income.date,
        description: income.description || "",
        createdAt: income.createdAt,
      })),
      totalIncome,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching incomes", error: err.message });
  }
};
//[POST] income
const addIncome = async (req, res) => {
  try {
    console.log(req.body);
    
    const { source, amount, description, category, user_id, date } = req.body;
    const newIncome = new Incomes({
      source,
      amount,
      description,
      date,
      category,
      user_id,
    });

    console.log('Saving new income:', newIncome);
    await newIncome.save();
    res.status(201).json({ message: 'Thêm thu nhập thành công', income: newIncome });
  } catch (error) {
    console.error("Error in addIncome:", error);
    res.status(400).json({ error: 'Lỗi khi thêm thu nhập' });
  }
};

// Xóa thu nhập
const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body.user_id);
    
    const deletedIncome = await Incomes.findOneAndDelete({ _id: id, user_id: req.body.user_id });

    if (!deletedIncome) {
      return res.status(404).json({ error: 'Thu nhập không tồn tại hoặc bạn không có quyền xóa' });
    }

    res.status(200).json({ message: 'Xóa thu nhập thành công', income: deletedIncome });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xóa thu nhập' });
  }
};

module.exports = {
  showIncomes,
  addIncome,
  deleteIncome,
};