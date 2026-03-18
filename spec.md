# DirectNest

## Current State
DirectNest is a property marketplace app with authentication, property listing, property detail, add property, messaging, and forgot password features. Backend has Users, Properties, Messages, and Reviews entities. Frontend has HomePage, AuthPage, AddPropertyPage, PropertyDetailPage routes.

## Requested Changes (Diff)

### Add
- Forgot password flow: a two-step flow where user enters their email, then resets their password

### Modify
- AuthPage: add a "Forgot password?" link on the login form that triggers the forgot password flow

### Remove
- Nothing

## Implementation Plan
1. Add a forgot password backend function: `resetPassword(email, newPassword)` that finds the user by email and updates their password
2. Add ForgotPasswordPage (or modal flow) with two steps: (1) enter email, (2) enter new password + confirm
3. Add route `/forgot-password` to App.tsx
4. Add "Forgot password?" link on the login form in AuthPage
