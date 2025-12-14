import React from "react";

const KickedScreen = () => (
  <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
      Session Ended
    </span>
    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-dark text-center">
      You’ve been Kicked out!
    </h1>
    <p className="text-neutral text-center max-w-md leading-relaxed">
      Looks like the teacher has removed you from the poll system. If you think
      this is a mistake, please contact your instructor.
    </p>
  </div>
);

export default KickedScreen;
