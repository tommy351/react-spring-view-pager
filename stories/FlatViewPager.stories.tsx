import React, { useState, useEffect } from "react";
import { FlatViewPager } from "../src/FlatViewPager";
import { Body } from "./Body";
import { Page } from "./Page";

export default {
  component: FlatViewPager,
  title: "FlatViewPager"
};

export function simple() {
  const [index, setIndex] = useState(0);
  const pageCount = 5;

  return (
    <Body>
      <FlatViewPager
        index={index}
        onPageChange={setIndex}
        pageCount={pageCount}
      >
        {({ index, state }) => (
          <Page index={index} pageCount={pageCount} state={state} />
        )}
      </FlatViewPager>
    </Body>
  );
}

export function keyboard() {
  const [index, setIndex] = useState(0);
  const pageCount = 5;

  function handleKeyup(e: KeyboardEvent) {
    function addIndex(n: number) {
      setIndex(prevIndex => {
        const newIndex = prevIndex + n;
        return newIndex >= 0 && newIndex < pageCount ? newIndex : prevIndex;
      });
    }

    switch (e.key) {
      case "ArrowLeft":
        addIndex(-1);
        break;

      case "ArrowRight":
        addIndex(1);
        break;
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, []);

  return (
    <Body>
      <FlatViewPager
        index={index}
        onPageChange={setIndex}
        pageCount={pageCount}
      >
        {({ index, state }) => (
          <Page index={index} pageCount={pageCount} state={state} />
        )}
      </FlatViewPager>
    </Body>
  );
}
