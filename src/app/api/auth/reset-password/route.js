import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { resetTokens } from '../forgot-password/route';

// Mock database - replace with your actual database connection
const mockUsers = [
    { id: 1, email: 'test@example.com', name: 'Test User', password: 'hashedpassword123' },
    { id: 2, email: 'user@example.com', name: 'User Name', password: 'hashedpassword456' },
    // Add more mock users as needed
];

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        // Validate input
        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json(
                { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
                { status: 400 }
            );
        }

        // Validate token
        if (!resetTokens.has(token)) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        const tokenData = resetTokens.get(token);

        // Check if token is expired
        if (Date.now() > tokenData.expiry) {
            resetTokens.delete(token);
            return NextResponse.json(
                { error: 'Reset token has expired. Please request a new one.' },
                { status: 400 }
            );
        }

        // Hash the new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Mock: Update user password in database
        // Replace this with your actual database update
        const userIndex = mockUsers.findIndex(u => u.email.toLowerCase() === tokenData.email.toLowerCase());
        if (userIndex !== -1) {
            mockUsers[userIndex].password = hashedPassword;
            console.log(`Password updated for user: ${tokenData.email}`);
        } else {
            console.log(`User not found for email: ${tokenData.email}`);
            // In a real app, you might want to handle this case differently
        }

        // Clean up the reset token
        resetTokens.delete(token);

        // Log successful password reset (for development)
        console.log('=== PASSWORD RESET SUCCESS ===');
        console.log('Email:', tokenData.email);
        console.log('Reset completed at:', new Date().toISOString());
        console.log('==============================');

        return NextResponse.json(
            { 
                message: 'Password has been reset successfully. You can now sign in with your new password.',
                success: true
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error. Please try again later.' },
            { status: 500 }
        );
    }
}

// Optional: Add a GET endpoint to validate token without resetting
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        // Validate token
        if (!resetTokens.has(token)) {
            return NextResponse.json(
                { valid: false, error: 'Invalid reset token' },
                { status: 400 }
            );
        }

        const tokenData = resetTokens.get(token);

        // Check if token is expired
        if (Date.now() > tokenData.expiry) {
            resetTokens.delete(token);
            return NextResponse.json(
                { valid: false, error: 'Reset token has expired' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { 
                valid: true,
                email: tokenData.email,
                expiresAt: new Date(tokenData.expiry).toISOString()
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}