import { FormEvent, useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import PollCard from "./PollCard";
import { enqueueSnackbar } from "notistack";
import client, { fetcher } from "../../modules/service/network";

import NoData from "../../common/nodata/NoData";
import useSWR, { mutate } from "swr";
import Pagination from "../../common/pagination/Pagination";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import { toast } from "react-toastify";
import Shimmer from "../../common/shimmer/Shimmer";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";

const ViewAllPoll = ()=>{
    const [polls, setPolls] = useState<any[] | null>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showSelect, setShowSelect] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(true);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);


    const buildUrl = () => {
      let url = `/polls/feed/search?page=${pageIndex}&size=10`;
      if (debouncedSearch.trim() !== "") {
        url += `&query=${debouncedSearch.trim()}`;
      }
      return url;
    };

    const { data: pollsData, error: pollsError } = useSWR(buildUrl, fetcher);

      useEffect(() => {
        if (pollsData) {
          setPolls(pollsData || []);
          // setTotalPages(pollsData.page.totalPages || 0);
          setLoader(false);
        }
        if ( pollsError) {
            enqueueSnackbar('Failed to fetch Polls', {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
            });
        }
      }, [pollsData, pollsError]);

      const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
      const toggleMultipleDeleteModal = ()=>{
        setMultipleDeleteModal(!openMultipleDeleteModal);
  }

  

    const deletePoll = async (id: string)=>{
        try{
            const response = await client.delete(`poll/${id}`)
            console.log(response)
            
            // fetchPolls()
            mutate(`/polls/feed?page=${pageIndex}&size=10`);
            toast.success("Poll deleted Successfully")
        }
        catch(err){
            console.log(err)
            enqueueSnackbar('Failed to delete Poll', {
                anchorOrigin: {
                  vertical: 'top',
                  horizontal: 'center',
                },
            });
        }
    }

    const handleSelect = (id: string) => {
        setSelectedIds(prevSelectedIds => {
          const updatedSelectedIds = new Set(prevSelectedIds);
          if (updatedSelectedIds.has(id)) {
            updatedSelectedIds.delete(id);
          } else {
            updatedSelectedIds.add(id);
          }
          return updatedSelectedIds;
        });

      };

      // Delete selected items via API
  const deleteSelectedItems = async () => {
    if (selectedIds.size === 0) return;

    try {
        const response = await client.delete('/polls/delete', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { pollIds: Array.from(selectedIds) },
        });

        if (response.status === 200) {
        setPolls((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
        setSelectedIds(new Set());
        toast.success("Selected items deleted successfully");
        mutate(`/polls?page=${pageIndex}&size=20&sort=createdAt,desc`);
        // fetchPolls()
      } else {
        throw new Error("Failed to delete selected items");
        setSelectedIds(new Set())
      }
    } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error("Error deleting selected items");
      setSelectedIds(new Set())
    }
  };

const handleSubmit = () => {
    deleteSelectedItems();
    setShowSelect(!showSelect)
    toggleMultipleDeleteModal()
  };


    useEffect(() => {
        // fetchPolls()
    }, [])
    return (
        <>

          {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Polls?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            // action1={{event: handleSubmit, label: "Delete"}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Selected Polls"
          />}

            {/* <PageTitle description='' breadcrumbs={[]}>
                Polls
            </PageTitle> */}

          <div className="mb-5 d-flex align-items-center justify-content-between">
            {/* <PageTitle description='' breadcrumbs={[]}>
              {status === "REVIEW_COMPLETE" ? "Reviewed Reels" : "Reels Under Review"}
            </PageTitle> */}
            <h2>Polls</h2>

            <input
              type="text"
              className="form-control"
              placeholder="Search poll..."
              value={search}
              onChange={(e) => {
                setPageIndex(0);
                setSearch(e.target.value);
              }}
              style={{ width: '30%', marginBottom:'5px' }}
            />
          </div>

            {/* {polls && polls.length > 0 && <div className="mb-8 d-flex" style={{background: ''}}>
                {showSelect ?<> <button
                  type="button"
                  onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                  disabled={selectedIds.size === 0}
                  className="btn btn-warning btn-sm mx-4"
                >
                  
                  Delete {selectedIds.size > 0 && (
                    <>
                      ({selectedIds.size} {selectedIds.size > 1 ? "Polls " : "Poll "})
                    </>
                  )}
                </button> 
                <button 
                type="button"
                onClick={()=>setShowSelect(!showSelect)}
                className="btn btn-primary btn-sm mx-4">
                  Cancel
                </button>
                </>
                : 
                <button
                  type="button"
                  onClick={()=>setShowSelect(!showSelect)} // Add onClick to trigger deletion

                  className="btn btn-warning btn-sm mx-1"
                >
                    Select
                </button>}
                
            </div>} */}


            {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div> :
            polls && polls.length > 0 ? <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
                {polls?.map((poll, index) => {
                    return (
                        <div className='col-12 col-sm-6 col-md-4 d-flex align-items-start' key={poll.id}>

                            {showSelect && (<input
                            type="checkbox"
                            checked={selectedIds.has(poll.id)}
                            onChange={() => handleSelect(poll.id)}
                            className="me-2"
                        />)}
                          <div className="w-100">
                            <PollCard poll={poll} deletePoll={deletePoll} />
                          </div>

                      </div>

                    )
                })}
            </div> : <div className=''><NoData title={"Polls"} createUrl={"/poll/create"}/></div>}


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
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
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
            disabled={!polls || polls.length < 10}
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
}

export default ViewAllPoll;