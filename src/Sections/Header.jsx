import { NormalDistribution } from "../Charts/NormalDistribution.jsx";
import React, { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";

export const Header = () => {
  const [isRendered, setIsRendered] = useState(false);
  return (
    <div className="relative flex w-full flex-col items-center justify-center max-sm:-m-6">
      <div
        className={`absolute rounded-xl bg-[#101723] p-2 transition-all delay-[1.5s] duration-1000 max-sm:-translate-y-40 max-sm:p-1`}
      >
        <h1 className="inline-block bg-gradient-to-r from-slate-200/60 to-slate-200 bg-clip-text text-center text-2xl font-bold text-transparent transition-all sm:text-3xl md:text-4xl lg:text-5xl">
          From Chaos to <span className="text-indigo-500">Normality</span>
          <br />
          <span className="text-2xl max-md:text-lg">
            {" "}
            <span className="cursor-pointer text-yellow-500">
              <a
                href="https://en.wikipedia.org/wiki/Central_limit_theorem"
                target="_blank"
                rel="noopener noreferrer"
              >
                Central Limit Theorem
              </a>
            </span>
          </span>{" "}
          <br />
          <span className="mx-auto mt-4 block max-h-[1080px] max-w-xl text-center text-lg max-md:max-w-md">
            Watch averages form a bell curve as sample sizes grow. The Central
            Limit Theorem reveals the predictability in randomness.
          </span>
        </h1>
      </div>

      <div className="h-[250px] w-full px-2 max-sm:translate-y-20 sm:h-[40svh] md:h-[50svh] md:pl-4 lg:h-[80svh]">
        <NormalDistribution />
      </div>

      {/*<div className="h-[600px] w-full md:w-2/3"><Line /></div>*/}
    </div>
  );
};
