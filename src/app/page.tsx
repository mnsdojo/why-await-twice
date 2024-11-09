import React from "react";
import Header from "./components/Header";
import PlayGround from "./components/PlayGround";

function Page() {
  return (
    <div className="container mx-auto px-4 py-12  ">
      <Header />
      <PlayGround />
    </div>
  );
}

export default Page;
