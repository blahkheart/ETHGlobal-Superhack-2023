import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const PageHOC = <T extends object>(Component: React.ComponentType<T>) => {
  const WrappedComponent = (T: any) => (
    <div className="pagehoc__container">
      <div className="">
        <Sidebar />
      </div>

      <div className="w-full px-8 lg:px-16">
        <Navbar />
        <Component {...T} />
      </div>
    </div>
  );

  // Set the display name for the wrapped component
  WrappedComponent.displayName = `PageHOC(${Component.displayName || Component.name || "Component"})`;

  return WrappedComponent;
};

export default PageHOC;
