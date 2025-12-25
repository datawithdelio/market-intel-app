require("dotenv").config();
const app = require("./app");

const PORT = Number(process.env.PORT || 8000);
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));


const centralBankRouter = require("./api/economy/centralBank");

app.use("/api/economy", centralBankRouter);
