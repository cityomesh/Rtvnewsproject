import {useEffect, useState} from "react";
import {PageTitle} from "../../../_metronic/layout/core";
import client, { fetcher }  from "../../modules/service/network";
import useSWR, { mutate } from "swr";
import {useSnackbar} from "notistack";
import {MatchCard} from "./MatchCard.tsx";
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import Shimmer from "../../common/shimmer/Shimmer.tsx";
import Pagination from "../../common/pagination/Pagination.tsx";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import NoData from "../../common/nodata/NoData.tsx";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal.tsx";

const ViewAllMatches = () => {
  const [matches, setMatches] = useState<any[] | null>([]);
  const [filteredMatches, setFilteredMatches] = useState<any[] | null>([]);
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [id, setId] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(0); 
  const [loader, setLoader] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  // const dataToRender = selectedYear ? filteredMatches : matches;


  const { data: matchesData, error: matchesError } = useSWR(
    // selectedSeason
    `/match/getAll?page=${pageIndex}&size=10&seasonDate=${selectedSeason}`,
    // : `/matches?page=${pageIndex}&size=9&sort=matchDate,desc`,
    fetcher
  );

  const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
    const toggleMultipleDeleteModal = ()=>{
      setMultipleDeleteModal(!openMultipleDeleteModal);
}

  useEffect(() => {
    if (matchesData) {

        // setMatches(matchesData._embedded?.matches)
        setMatches(matchesData)
        // setTotalPages(matchesData.page.totalPages)
        setLoader(false);
        console.log(matches)
    }
    if ( matchesError) {
        enqueueSnackbar('Failed to fetch Matches', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
        });
    }
  }, [matchesData, matchesError]);

  
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const season = event.target.value;
    setSelectedSeason(season);
    setPageIndex(0);
  };
 
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = ()=>{
      setOpenModal(!openModal);
}

  function decrement() {
    if (pageIndex > 0) {
      setPageIndex(pageIndex-1)
    }
  }
  function increment() {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex+1)
    }
  }
  const deleteMatch = async (id: string) => {
    try {
      const response = await client.delete(`/match/${id}`)
      if (response.status === 200) {
        toast.success("Match Deleted!");
        // mutate(`/matches?page=${pageIndex}&size=9&sort=matchDate,desc`);
        mutate(`/match/getAll?page=${pageIndex}&size=10&seasonDate=${selectedSeason}`);
      } else throw "404 response"
    } catch (err) {
      console.log(err)
      toast.error("Failed to delete match")
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
        const response = await client.delete(`/post/delete`, {
          data: { postIds: Array.from(selectedIds) }
        });

        if (response.status === 200) {
          setMatches((prevPosts) => prevPosts ? prevPosts.filter((item) => !selectedIds.has(item.id)) : null);
          setSelectedIds(new Set());
          toast.success("Selected items deleted successfully");
          mutate(`/matches?page=${pageIndex}&size=9&sort=matchDate,desc`);
          // mutate(`/match/getAll?page=${pageIndex}&size=10&seasonDate=${selectedSeason}`);
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
        console.log("handle delete")
        // event.preventDefault();
        deleteSelectedItems();
        setShowSelect(!showSelect)
        toggleMultipleDeleteModal()
    };
  
  return (
      <div>
        <>
        {openModal && <Modal
          header="Delete Match?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{event: toggleModal, label: 'Cancel'}}
          action1={{event: ()=>{deleteMatch(id); toggleModal();}, label: "Delete"}}
          title="Match"
        />}


        {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Matches?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            // action1={{event: handleSubmit, label: "Delete"}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Matches"
          />} 
        </>

        <PageTitle description='' breadcrumbs={[]}>
          Matches
        </PageTitle>


        {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div> 
            : <>
            <div className="mb-8 d-flex align-items-center justify-content-between" style={{background: ''}}>
              <div className="">
                {showSelect ? (
                <>
                <button
                  type="button"
                  onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                  disabled={selectedIds.size === 0}
                  className="btn btn-warning btn-sm mx-6"
                >
                    Delete {selectedIds.size > 0 && (
                        <>
                          ({selectedIds.size} {selectedIds.size > 1 ? "Matches" : "Match "})
                        </>
                    )}
                </button>
                <button 
                type="button"
                onClick={()=>setShowSelect(!showSelect)}
                className="btn btn-primary btn-sm">
                  Cancel
                </button>
                </>
                ) : (
                <button
                  type="button"
                  onClick={()=>setShowSelect(!showSelect)} // Add onClick to trigger deletion

                  className="btn btn-warning btn-sm mx-1"
                >
                    Select
                </button>
                )}
                </div>
                <div className="ms-auto">
                  <select
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                    className="form-select form-select-sm"
                  >
                    <option value="">All Sessions</option>
                    {Array.from({ length: 30 }, (_, index) => {
                      const startYear = 2020 + index;
                      const endYear = startYear + 1;
                      const season = `${startYear}-${endYear}`;
                      return (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* <div> */}

                {/* </div> */}
                
            </div>
          {matches && matches.length > 0 ? <div className='row g-6 g-xl-9 mb-6 mb-xl-9 d-flex align-items-center'>
          {/* {dataToRender && dataToRender.length > 0 ? <div className='row g-6 g-xl-9 mb-6 mb-xl-9 d-flex align-items-center'> */}
          {/* {dataToRender.map((match, index) => { */}
          {matches.map((match, index) => {
            return (
                // <div key={element.id} className="col-12 col-sm-6 col-md-4 col-xl-4 d-flex align-items-start mb-6">
                  
                // <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4' key={match._links.self.href}>
                <div className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4' key={match.id}>
                  <div className="d-flex align-items-start">
                  {showSelect && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(match?.id)}
                      onChange={() => handleSelect(match?.id)}
                      className="me-2"
                    />
                  )}
                  <div className="w-100">
                  <MatchCard
                      match={match}
                      button1={() => {
                        // const newId = match._links.self.href.split("/").pop();
                        navigate(`/matches/create/${match.id}`);
                      }}
                      button2={async () => {
                        // const idToDelete = match._links.self.href.split("/").pop();
                        // setId(idToDelete);
                        setId(match.id);
                        // await deleteMatch(idToDelete)
                        toggleModal()
                      }}
                  />
                </div>
              </div>
            </div>
            )
          })}
          </div> : <div className=''><NoData title={"Match"} createUrl={"/matches/create"}/></div>}
          </>
        }


      {/* <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPrevious={() => setPageIndex(pageIndex - 1)}
          onNext={() => setPageIndex(pageIndex + 1)}
        />*/}
      

          {matches && matches.length > 0 && <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    // marginTop: "20px",
                    marginBottom: "20px",
                    marginTop: "auto"
                }}
            >
          <button
            disabled={ pageIndex === 0 ? true : false }
            onClick={() => setPageIndex(pageIndex - 1)}
            className='bg-light'
            style={{
              marginRight: "10px",
              width: "100px",
              height: "40px",
              borderRadius: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "2px solid white",
              padding: "10px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {" "}
            Previous
          </button>
  
          <button
            disabled={ matches?.length < 9 ? true : false }
            className='bg-light'
            onClick={() => setPageIndex(pageIndex + 1)}
            style={{
              marginLeft: "10px",
              width: "100px",
              height: "40px",
              borderRadius: "20px",
              // backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              border: "2px solid white",
              padding: "10px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {" "}
            Next
          </button>
        </div>}
        </div> 
  );
};

export default ViewAllMatches;