//show all blogs
import react from "react";
import { AllBlogs } from "./AllBlogs";
import { PageTitle } from "../../../_metronic/layout/core";
export default function CreateBlogs() {
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        All Blogs
      </PageTitle>
      <AllBlogs />
    </>
  );
}