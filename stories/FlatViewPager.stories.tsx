import React, { useState } from "react";
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
        {({ index }) => <Page index={index} pageCount={pageCount} />}
      </FlatViewPager>
    </Body>
  );
}
