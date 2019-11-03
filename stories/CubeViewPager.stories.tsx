import React, { useState } from "react";
import { CubeViewPager } from "../src/CubeViewPager";
import { Body } from "./Body";
import { Page } from "./Page";

export default {
  component: CubeViewPager,
  title: "CubeViewPager"
};

export function simple() {
  const [index, setIndex] = useState(0);
  const pageCount = 5;

  return (
    <Body>
      <CubeViewPager
        index={index}
        onPageChange={setIndex}
        pageCount={pageCount}
      >
        {({ index }) => <Page index={index} pageCount={pageCount} />}
      </CubeViewPager>
    </Body>
  );
}
