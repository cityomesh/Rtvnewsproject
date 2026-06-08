//show all news
import react from "react";
import { AllNews } from "./view-news/AllNews";
import { PageTitle } from "../../../_metronic/layout/core";
export default function News() {
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        All News
      </PageTitle>
      <AllNews />
    </>
  );
}