import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/v1/hello", (req, res) => {
    res.json({ message: "Hello from Node.js!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});