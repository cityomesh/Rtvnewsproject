import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { enqueueSnackbar } from "notistack";
import ReelCard from "./ReelCard";
import client, { fetcher } from "../../modules/service/network";
import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import Pagination from "../../common/pagination/Pagination";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";

interface AllReelsProps {
  status: "REVIEW_COMPLETE" | "UNDER_REVIEW";
}

const AllReels: React.FC<AllReelsProps> = ({ status }) => {
  const [reels, setReels] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loader, setLoader] = useState<boolean>(true);
  const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const toggleMultipleDeleteModal = () => {
    setMultipleDeleteModal(!openMultipleDeleteModal);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const buildUrl = () => {
    let url = `/reels/dashboard/search?status=${status}`;

    if (debouncedSearch.trim() !== "") {
      url += `&query=${debouncedSearch.trim()}`;
    }

    url += `&page=${pageIndex}&size=10`;
    return url;
  };


  const { data: reelsData, error: reelError } = useSWR(buildUrl(), fetcher);


  useEffect(() => {
    if (reelsData) {
      setReels(reelsData || []);
      setLoader(false);
    }
    if (reelError) {
      toast.error("Failed to load Reels");
      setLoader(false);
    }
  }, [reelsData, reelError]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;
    try {
      const response = await client.delete('/reel/delete', {
        headers: { 'Content-Type': 'application/json' },
        data: { reelIds: Array.from(selectedIds) },
      });
      if (response.status === 200) {
        setReels(prev => prev.filter((item) => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
        enqueueSnackbar("Selected items deleted successfully", { variant: "success" });
        mutate(`/reels/dashboard?status=${status}&page=${pageIndex}&size=10`);
        
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to delete selected items', { variant: "error" });
      setSelectedIds(new Set());
    }
  };

  const handleSubmit = () => {
    deleteSelectedItems();
    setShowSelect(false);
    toggleMultipleDeleteModal();
  };

  return (
    <>
      {openMultipleDeleteModal && (
        <MultipleDeleteModal
          header="Delete Reels?"
          isOpen={openMultipleDeleteModal}
          toggleDialog={toggleMultipleDeleteModal}
          action2={{ event: toggleMultipleDeleteModal, label: 'Cancel' }}
          action1={{ event: handleSubmit, label: "Delete" }}
          title="Selected Reels"
        />
      )}
      <div className="mb-5 d-flex align-items-center justify-content-between">
        <h2>{status === "REVIEW_COMPLETE" ? "Reviewed Reels" : "Reels Under Review"}</h2>

        <input
          type="text"
          className="form-control"
          placeholder="Search reels..."
          value={search}
          onChange={(e) => {
            setPageIndex(0);
            setSearch(e.target.value);
          }}
          style={{ width: '30%', marginBottom:'5px' }}
        />
      </div>

      {loader ? (
        <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
          <Shimmer />
        </div>
      ) : reels && reels.length > 0 ? (
        <>
          {/* <div className="mb-8 d-flex">
            {showSelect ? (
              <>
                <button
                  onClick={toggleMultipleDeleteModal}
                  disabled={selectedIds.size === 0}
                  className="btn btn-warning btn-sm mx-8"
                >
                  Delete ({selectedIds.size} selected)
                </button>
                <button
                  onClick={() => setShowSelect(false)}
                  className="btn btn-primary btn-sm mx-1"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowSelect(true)}
                className="btn btn-warning btn-sm mx-4"
              >
                Select
              </button>
            )}
          </div> */}

          <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
            {reels.map((reel) => (
              <div className="col-12 col-sm-6 col-md-4 col-xl-4" key={reel?.id}>
                <div className="d-flex align-items-start">
                  {showSelect && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(reel?.id)}
                      onChange={() => handleSelect(reel?.id)}
                      className="me-2"
                    />
                  )}
                  <div className="w-100">

                    
                    <ReelCard reel={reel} pageIndex={pageIndex} status={status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <NoData title="Reel" createUrl="/reels/create" />
      )}

      {/* <Pagination
        pageIndex={pageIndex}
        totalPages={totalPages}
        onPrevious={() => setPageIndex(pageIndex - 1)}
        onNext={() => setPageIndex(pageIndex + 1)}
      /> */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <button
          disabled={pageIndex === 0}
          onClick={() => setPageIndex((prev) => prev - 1)}
          className="bg-light"
          style={{
            marginRight: 10,
            width: 100,
            height: 40,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: 10,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Previous
        </button>

        <button
          disabled={reels.length < 10}
          onClick={() => setPageIndex((prev) => prev + 1)}
          className="bg-light"
          style={{
            marginLeft: 10,
            width: 100,
            height: 40,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            border: "2px solid white",
            padding: 10,
            boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default AllReels;
