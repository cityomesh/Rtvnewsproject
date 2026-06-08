//show all updates
import react from "react";
import { AllUpdates } from "./AllUpdates";
import { PageTitle } from "../../../_metronic/layout/core";
export default function CreateUpdates() {
  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>
        All Updates
      </PageTitle>
      <AllUpdates />
    </>
  );
}
