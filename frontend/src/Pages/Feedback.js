import React from "react";

const Feedback = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold">Feedback</h2>
    <textarea placeholder="Enter your feedback" className="border p-2 mt-4 w-full h-32"></textarea>
    <button className="bg-yellow-500 text-white px-4 py-2 mt-4">Submit Feedback</button>
  </div>
);

export default Feedback;
