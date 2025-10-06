# Verification System

This document describes the verification system implemented for CareerOstad AI Job Matching platform.

## Overview

The verification system allows candidates and companies to pay for profile verification, which displays a verified badge next to their names throughout the platform.

## Pricing

- **Candidates**: $20 USD for verification
- **Companies**: $50 USD for verification

## Features

### 1. Payment Processing
- Uses Stripe for secure payment processing
- Different pricing for candidates vs companies
- One-time payment for lifetime verification

### 2. Verification Badge
- Blue checkmark badge displayed next to verified user names
- Available in multiple sizes (xs, sm, md, lg, xl)
- Optional text display ("Verified")

### 3. User Interface
- Dedicated verification page at `/dashboard/verification`
- Integration in profile pages
- Success page after payment completion

## API Endpoints

### `/api/verification/create-payment-intent`
- **Method**: POST
- **Body**: `{ "userType": "candidate" | "company" }`
- **Response**: `{ "clientSecret": string, "amount": number }`

### `/api/verification/status`
- **Method**: GET
- **Response**: `{ "isVerified": boolean, "verifiedAt": string, "verificationType": string, "userRole": string }`

### `/api/verification/webhook`
- **Method**: POST
- **Purpose**: Stripe webhook to handle successful payments
- **Updates**: User verification status in database

## Database Schema

The following fields are added to the user collection:

```javascript
{
  isVerified: boolean,
  verifiedAt: Date,
  verificationType: string, // "candidate" or "company"
  verificationPaymentId: string // Stripe payment intent ID
}
```

## Components

### `VerificationPayment`
Main component for the verification payment flow.

### `VerificationCheckout`
Stripe checkout component for processing payments.

### `VerifiedBadge`
Reusable badge component for displaying verification status.

## Environment Variables

Required environment variables:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Usage

1. Users navigate to `/dashboard/verification`
2. Select their user type (candidate/company)
3. Complete payment through Stripe
4. Webhook updates verification status
5. Verified badge appears throughout the platform

## Security

- All payments processed through Stripe
- Webhook signature verification
- User authentication required for all endpoints
- Verification status stored securely in database
