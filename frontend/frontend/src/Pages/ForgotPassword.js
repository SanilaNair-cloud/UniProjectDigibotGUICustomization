import React from "react";

const ForgotPassword = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold">Forgot Password</h2>
    <p className="mt-2">Enter your email to reset your password.</p>
    <input type="email" placeholder="Email" className="border p-2 mt-4" />
    <button className="bg-red-500 text-white px-4 py-2 mt-4">Submit</button>
  </div>
);

export default ForgotPassword;
