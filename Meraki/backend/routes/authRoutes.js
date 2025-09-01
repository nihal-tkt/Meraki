// authRoutes.js
import express from 'express';
import passport from 'passport';
import { registerUser, loginUser } from '../controllers/userController.js';
import { validateRegister } from "../middleware/validateRegister.js";
import { validateLogin } from "../middleware/validateLogin.js";
import jwt from "jsonwebtoken";


const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Route to register a user
router.post('/register', validateRegister, registerUser);

// Route to login a user
router.post('/login', validateLogin, loginUser);

// Google Auth Routes
router.get('/google',(req,res,next) => {
    const role = req.query.role || 'student'; // Default to 'student' if not provided
    req.session.role = role; // Store role in session temporarily
    next();
} ,passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login', // Redirect if authentication fails
}), (req, res) => {
    // Successful authentication, redirect to your desired route
    const token = jwt.sign(
        { id: req.user.id, role: req.user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
    );
    console.log(res.status);
    res.status(200).json({ message: 'Login successful', token });
    // res.redirect("http://localhost:5173/home"); // Change to your main app route
});

// router.get("/api/v1/auth/google/callback", 
//     passport.authenticate("google", { failureRedirect: "/login" }),
//     (req, res) => {
//       const role = req.session.role || 'student';
//       delete req.session.role;
  
//       // Redirect after successful login; ensure only one response is sent
//       if (!res.headersSent) {
//         res.redirect("http://localhost:5173/home");
//       }
//     }
//   );

// Facebook Auth Routes
// router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/facebook/callback', passport.authenticate('facebook', {
//     failureRedirect: '/login',
// }), (req, res) => {
//     res.redirect('/'); // Change to your main app route
// });

export default router;
