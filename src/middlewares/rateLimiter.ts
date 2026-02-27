import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: 100, // 100 requests mỗi phút
    message: "Too many requests",
    skip: (req) => req.ip === "127.0.0.1", // Bỏ qua localhost
    handler: (req, res) => {
        // Custom response
        res.status(429).json({
            error: "Max request limit reached",
            retryAfter: "Please try again later",
        });
    },
    headers: true, // Thêm headers X-RateLimit-*
});

export default rateLimiter;