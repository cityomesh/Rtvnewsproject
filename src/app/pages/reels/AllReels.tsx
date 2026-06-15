import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { enqueueSnackbar } from "notistack";
import ReelCard from "./ReelCard";
import client, { fetcher } from "../../modules/service/network";
import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";
import { moveToTrash, isInTrash } from "../../modules/service/trashService";   // ✅ trash service
import { getCurrentUser } from "../../modules/auth/session";

interface AllReelsProps {
  status: "REVIEW_COMPLETE" | "UNDER_REVIEW";
}

const AllReels: React.FC<AllReelsProps> = ({ status }) => {
  const [reels, setReels] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [pageIndex, setPageIndex] = useState(0);
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
    if (debouncedSearch.trim() !== "") url += `&query=${debouncedSearch.trim()}`;
    url += `&page=${pageIndex}&size=10`;
    return url;
  };

  const { data: reelsData, error: reelError } = useSWR(buildUrl(), fetcher);

  useEffect(() => {
    if (reelsData) {
      // ✅ Filter out reels that are in trash
      let filtered = reelsData || [];
      filtered = filtered.filter((reel: any) => !isInTrash(reel.id, 'reel'));
      setReels(filtered);
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

  // ✅ Batch delete – move each to trash + API batch delete
  const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("User not logged in");
      return;
    }

    // 1. Move each selected reel to trash (localStorage)
    const reelsToDelete = reels.filter(r => selectedIds.has(r.id));
    for (const reel of reelsToDelete) {
      moveToTrash({
        id: reel.id,
        type: 'reel',
        data: reel,
      }, currentUser.username);
    }

    // 2. Call batch delete API
    try {
      const response = await client.delete('/reel/delete', {
        headers: { 'Content-Type': 'application/json' },
        data: { reelIds: Array.from(selectedIds) },
      });
      if (response.status === 200) {
        setReels(prev => prev.filter((item) => !selectedIds.has(item.id)));
        setSelectedIds(new Set());
        enqueueSnackbar("Selected reels moved to trash and deleted from server!", { variant: "success" });
        mutate(`/reels/dashboard?status=${status}&page=${pageIndex}&size=10`);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to delete selected reels', { variant: "error" });
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
      ) : (
        <NoData title="Reel" createUrl="/reels/create" />
      )}

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
