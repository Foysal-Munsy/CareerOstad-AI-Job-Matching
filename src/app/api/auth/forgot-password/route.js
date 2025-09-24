import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Mock database - replace with your actual database connection
const mockUsers = [
    { id: 1, email: 'test@example.com', name: 'Test User', password: 'hashedpassword123' },
    { id: 2, email: 'user@example.com', name: 'User Name', password: 'hashedpassword456' },
    // Add more mock users as needed
];

// Mock reset tokens storage - replace with your actual database
const resetTokens = new Map();

export async function POST(request) {
    try {
        const { email } = await request.json();

        // Validate input
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Mock: Check if user exists in database
        // Replace this with your actual database query
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Always return success message for security (don't reveal if email exists)
        // In production, you might want to implement rate limiting here
        
        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Mock: Store reset token in database
        // Replace this with your actual database storage
        resetTokens.set(resetToken, {
            email: email.toLowerCase(),
            userId: user?.id,
            expiry: resetTokenExpiry,
            createdAt: new Date().toISOString()
        });

        // Create reset URL
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Check if email configuration is available
        const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS;
        
        if (hasEmailConfig) {
            // Send email using nodemailer
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Password Reset Request - CareerOstad',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2563eb; font-size: 28px; margin: 0;">CareerOstad</h1>
                                <p style="color: #6b7280; margin: 5px 0 0 0;">AI-Powered Job Matching Platform</p>
                            </div>
                            
                            <div style="background: #f8fafc; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
                                <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 15px 0;">Reset Your Password</h2>
                                <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
                                    You requested a password reset for your CareerOstad account. Click the button below to reset your password.
                                </p>
                                
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${resetUrl}" 
                                       style="background: linear-gradient(135deg, #2563eb, #1d4ed8); 
                                              color: white; 
                                              text-decoration: none; 
                                              padding: 12px 30px; 
                                              border-radius: 8px; 
                                              font-weight: 600; 
                                              display: inline-block;
                                              box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);">
                                        Reset Password
                                    </a>
                                </div>
                                
                                <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 20px 0 0 0;">
                                    This link will expire in 1 hour for security reasons. If you didn't request this password reset, 
                                    please ignore this email or contact our support team.
                                </p>
                            </div>
                            
                            <div style="text-align: center; color: #9ca3af; font-size: 12px;">
                                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                                <p style="word-break: break-all; background: #f3f4f6; padding: 10px; border-radius: 6px; margin: 10px 0;">
                                    ${resetUrl}
                                </p>
                            </div>
                            
                            <div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 20px; text-align: center;">
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">
                                    © 2024 CareerOstad. All rights reserved.
                                </p>
                            </div>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                console.log(`✅ Password reset email sent to: ${email}`);
                
            } catch (emailError) {
                console.error('❌ Email sending failed:', emailError);
                console.log('=== DEVELOPMENT MODE - EMAIL FAILED ===');
                console.log('Reset URL:', resetUrl);
                console.log('====================================');
            }
        } else {
            // Development mode - no email config
            console.log('=== DEVELOPMENT MODE - NO EMAIL CONFIG ===');
            console.log('📧 Email would be sent to:', email);
            console.log('🔗 Reset URL:', resetUrl);
            console.log('📝 To enable email sending, add EMAIL_USER and EMAIL_PASS to .env');
            console.log('=========================================');
        }

        return NextResponse.json(
            { 
                message: 'If an account with that email exists, we have sent a password reset link.',
                // In development, you might want to include the reset URL
                ...(process.env.NODE_ENV === 'development' && { resetUrl })
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

// Export the resetTokens for use in reset-password route
export { resetTokens };