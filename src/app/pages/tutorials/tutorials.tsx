//show all tutorials
import react from "react";
import { AllTutorials } from "./AllTutorials";
import { PageTitle } from "../../../_metronic/layout/core";
export default function CreateBlogs() {
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        All Tutorials
      </PageTitle>
      <AllTutorials />
    </>
  );
}