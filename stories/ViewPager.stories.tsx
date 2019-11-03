import React, { useState } from "react";
import ViewPager from "../src/ViewPager";
import { Body } from "./Body";
import { Page } from "./Page";

export default {
  component: ViewPager,
  title: "ViewPager"
};

export function simple() {
  const [index, setIndex] = useState(0);
  const pageCount = 5;

  return (
    <Body>
      <ViewPager index={index} pageCount={pageCount} onChangeIndex={setIndex}>
        {({ index }) => <Page index={index} pageCount={pageCount} />}
      </ViewPager>
    </Body>
  );
}
