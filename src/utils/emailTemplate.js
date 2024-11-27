const registrationTemplate = (username) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Welcome to Our Platform, ${username}!</h2>
        <p>Thank you for registering. We're excited to have you on board.</p>
        <p>If you have any questions, feel free to reach out to us anytime.</p>
        <p>Cheers,</p>
        <p>The Team</p>
    </div>
`

const loginNotificationTemplate = (username) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2>Hello, ${username}</h2>
        <p>We noticed a new sign-in to your account.</p>
        <p>If this was you, you can safely disregard this message.</p>
        <p>If you didn't sign in, please contact support immediately.</p>
        <p>Best regards,</p>
        <p>The Security Team</p>
    </div>
`;


export {
    registrationTemplate,
    loginNotificationTemplate
}