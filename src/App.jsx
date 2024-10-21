import React, { useState, useEffect, useRef } from "react";
import DataPointsComponent from "./ChartComponents/DataPointsComponent.jsx";
import AveragePointComponent from "./ChartComponents/AveragePointComponent.jsx";
import SamplingDistributionComponent from "./ChartComponents/SamplingDistributionComponent.jsx";
import { Line } from "./Charts/Line.jsx";
import BackgroundAnimation from "./UI/BackgroundAnimation.jsx";
import { NormalDistribution } from "./Charts/NormalDistribution.jsx";
import { Header } from "./Sections/Header.jsx";
import { MathJax, MathJaxContext } from "better-react-mathjax";

document.body.style = "background: #101723"; // #101723

function App() {
  const secondSectionRef = useRef(null);

  const handleScrollToSection = () => {
    if (secondSectionRef.current) {
      secondSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    // <div className="App font-poppins relative mx-auto flex min-h-screen max-w-screen-xl snap-y snap-mandatory flex-col items-center justify-center overflow-y-auto">
    //   <div className="relative flex h-screen w-full snap-start items-center justify-center">
    //     <Header />
    //     {/*<div id="sd-container" className="absolute bottom-[10%]">*/}
    //     {/*  <div className="arrow"></div>*/}
    //     {/*  <div className="arrow"></div>*/}
    //     {/*</div>*/}
    //   </div>
    //   <div className="h-screen w-full shrink-0 snap-start">e</div>
    // </div>
    <div className="noscroll mx-auto h-screen w-full max-w-screen-2xl snap-y snap-mandatory overflow-y-auto px-4">
      <BackgroundAnimation />
      <div className="relative flex h-[100svh] w-full snap-start items-center justify-center">
        <Header />
        <div
          onClick={handleScrollToSection}
          id="sd-container"
          className="absolute bottom-[10%] cursor-pointer"
        >
          <div className="arrow"></div>
          <div className="arrow"></div>
        </div>
      </div>
      <div
        ref={secondSectionRef}
        className="flex h-[100svh] w-full snap-start flex-col items-center justify-center md:flex-row"
      >
        <div className="w-1/3">Hello</div>
        <div className="-mt-24 h-[85svh] w-full md:w-2/3">
          <Line />
        </div>
        {/*<div className="mt-5 flex w-full items-center justify-center font-poppins text-lg text-slate-300 md:mx-8">*/}
        {/*  <div className="flex w-full flex-col items-center justify-center space-y-2 max-sm:text-sm sm:flex-col">*/}
        {/*    <a*/}
        {/*      href="#_"*/}
        {/*      className="group relative inline-flex w-full items-center justify-center overflow-hidden text-nowrap rounded-md px-6 py-3 font-bold text-[#ccbc66] shadow-2xl hover:text-slate-200"*/}
        {/*    >*/}
        {/*      <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 opacity-0 transition duration-300 ease-out group-hover:opacity-100"></span>*/}

        {/*      <span className="absolute left-0 top-0 h-1/3 w-full bg-gradient-to-b from-white to-transparent opacity-5"></span>*/}

        {/*      <span className="absolute bottom-0 left-0 h-1/3 w-full bg-gradient-to-t from-white to-transparent opacity-5"></span>*/}

        {/*      <span className="absolute bottom-0 left-0 h-full w-4 bg-gradient-to-r from-white to-transparent opacity-5"></span>*/}

        {/*      <span className="absolute bottom-0 right-0 h-full w-4 bg-gradient-to-l from-white to-transparent opacity-5"></span>*/}
        {/*      <span className="absolute inset-0 h-full w-full rounded-md border border-white opacity-10"></span>*/}
        {/*      <span className="absolute h-0 w-0 rounded-full bg-white opacity-5 transition-all duration-300 ease-out group-hover:h-56 group-hover:w-56"></span>*/}
        {/*      <span className="relative">ITS EVERYWHERE</span>*/}
        {/*    </a>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className="flex-col items-center justify-center space-y-2">*/}
        {/*  <div className="flex items-center justify-center rounded-full p-4 ring-4 transition-all hover:bg-indigo-950">*/}
        {/*    <div className="h-[100px] w-[200px]">*/}
        {/*      <NormalDistribution />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*  <p className="text-xl text-slate-200">*/}
        {/*    Explore the Normal Distribution*/}
        {/*  </p>*/}
        {/*</div>*/}
      </div>
      {/*<div*/}
      {/*  ref={secondSectionRef}*/}
      {/*  className="flex h-[100dvh] w-full snap-start items-center justify-center bg-orange-200/10 text-8xl"*/}
      {/*>*/}
      {/*  3*/}
      {/*</div>*/}
    </div>
  );
}

export default App;
