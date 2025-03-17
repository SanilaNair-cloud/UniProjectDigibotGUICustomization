import React from "react";

const Login = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold">Login</h2>
    <input type="email" placeholder="Email" className="border p-2 mt-4" />
    <input type="password" placeholder="Password" className="border p-2 mt-2" />
    <button className="bg-blue-500 text-white px-4 py-2 mt-4">Login</button>
  </div>
);

export default Login;

