const Visitor = require('../models/Visitor');

const getClientIP = (req) => {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
};

// Dışarıdan erişilebilir hale getirilmiş fonksiyon
const getGraphData = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const data = await Visitor.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          visitors: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const result = data.map(item => ({
      date: item._id,
      visitors: item.visitors
    }));

    res.json(result);
  } catch (err) {
    console.error("Grafik verisi hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

const trackVisitor = async (req, res) => {
  const ip = getClientIP(req);

  try {
    const existing = await Visitor.findOne({ ip });
    if (existing) {
      existing.lastActive = new Date();
      await existing.save();
    } else {
      await Visitor.create({ ip });
    }

    const totalVisitors = await Visitor.countDocuments();
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    const onlineUsers = await Visitor.countDocuments({ lastActive: { $gte: twoMinutesAgo } });

    res.json({ totalVisitors, onlineUsers });
  } catch (err) {
    console.error('Ziyaretçi sayacı hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// 🔥 Dışa doğru doğru export
module.exports = { trackVisitor, getGraphData };
