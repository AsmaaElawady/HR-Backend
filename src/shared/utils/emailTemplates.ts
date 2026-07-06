export const approvedVacationEmail = (data: {
    employeeName: string;
    fromDate: string;
    toDate: string;
    days: number;
    remainingDays: number;
}): string => `
    <h2>Your Vacation Has Been Approved!</h2>
    <p>Dear ${data.employeeName},</p>
    <p>Your vacation request has been approved.</p>
    <p><strong>From:</strong> ${data.fromDate}</p>
    <p><strong>To:</strong> ${data.toDate}</p>
    <p><strong>Days:</strong> ${data.days}</p>
    <p><strong>Remaining vacation days:</strong> ${data.remainingDays}</p>
    <br/>
    <p>HR Team</p>
`;

export const rejectedVacationEmail = (data: {
    employeeName: string;
    fromDate: string;
    toDate: string;
}): string => `
    <h2>Your Vacation Request Was Rejected</h2>
    <p>Dear ${data.employeeName},</p>
    <p>Unfortunately your vacation request has been rejected.</p>
    <p><strong>From:</strong> ${data.fromDate}</p>
    <p><strong>To:</strong> ${data.toDate}</p>
    <p>Please contact HR for more details.</p>
    <br/>
    <p>HR Team</p>
`;

export const welcomeEmail = (data: {
    email: string;
    password: string;
}): string => `
    <h2>Welcome to the HR System!</h2>
    <p>Your account has been created. Here are your login credentials:</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Password:</strong> ${data.password}</p>
    <p>Please log in and change your password immediately.</p>
    <br/>
    <p>HR Team</p>
`;