import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { enqueueSnackbar } from "notistack";
import PlayerCard from "./PlayerCard";
import useSWR, { mutate } from "swr";
import client,{ fetcher } from "../../modules/service/network";
import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";
import { MultipleDeleteModal } from "../../../_metronic/partials/widgets/modal/MultipleDeleteModal";
import { toast } from "react-toastify";


const ViewAllPlayers = ()=>{
    const [players, setPlayers] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showSelect, setShowSelect] = useState<boolean>(false)
    const [pageIndex, setPageIndex] = useState(0);
    const [loader, setLoader] = useState<boolean>(true);

    const [openMultipleDeleteModal, setMultipleDeleteModal] = useState(false);
    const toggleMultipleDeleteModal = ()=>{
      setMultipleDeleteModal(!openMultipleDeleteModal);
    }

    const { data: playersData, error: playersError } = useSWR(
      `/members?page=${pageIndex}&size=9&memberType=PLAYER`,
      fetcher
    );

    useEffect(() => {
      if (playersData) {
        setPlayers(playersData || []);
        setLoader(false);
     
      }
      if ( playersError) {
        console.log(playersError);
        toast.error("Failed to load Player Details");
      }
    }, [playersData, playersError]);

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

    const handlePrev = () => {
      if (pageIndex > 0) setPageIndex((prev) => prev - 1);
    };

    const handleNext = () => {
      setPageIndex((prev) => prev + 1);
      console.log("pageIndex", pageIndex)
    };


    const deleteSelectedItems = async () => {
      if (selectedIds.size === 0) return;
  
      try {
        const response = await client.delete('player/delete', {
          headers: { 'Content-Type': 'application/json' },
          data: { playerIds: Array.from(selectedIds) }
        });
    
        if (response.status === 200) {
          enqueueSnackbar("Selected items deleted successfully", { variant: "success" });
          await mutate(`/members?page=${pageIndex}&size=9&memberType=PLAYER`);
        } else {
          throw new Error("Failed to delete selected items");
        }
      } catch (error) {
        console.error('Error deleting selected items:', error);
        enqueueSnackbar("Failed to delete selected items", { variant: "error" });
        await mutate(`/members?page=${pageIndex}&size=9&memberType=PLAYER`);
      }
  };

    const handleSubmit = () => {
      
      deleteSelectedItems();
      
      setShowSelect(!showSelect)

      toggleMultipleDeleteModal()
    };

    
    return (
        <>
          {openMultipleDeleteModal && <MultipleDeleteModal
            header="Delete Players?"
            isOpen={openMultipleDeleteModal}
            toggleDialog={toggleMultipleDeleteModal}
            action2={{event: toggleMultipleDeleteModal, label: 'Cancel'}}
            // action1={{event: handleSubmit, label: "Delete"}}
            action1={{event: handleSubmit, label: "Delete"}}
            title="Selected Players"
          />}

            <PageTitle description='' breadcrumbs={[]}>
                Players
            </PageTitle>
            
            {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>
            : 
            players ? (
            <>
                <div className="mb-8 d-flex">
                  {showSelect ? (
                    <>
                  <button
                    type="button"
                    onClick={toggleMultipleDeleteModal} // Add onClick to trigger deletion
                    disabled={selectedIds.size === 0}
                    className="btn btn-warning btn-sm mx-6"
                  >
                      {/* Delete {selectedIds.size > 1 && ({selectedIds.size >= 1 && selectedIds.size} {selectedIds.size > 1 ? "Reels ": "Reel "})} */}
                      Delete {selectedIds.size > 0 && (
                        <>
                          ({selectedIds.size} {selectedIds.size > 1 ? "Players" : "Player"})
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
                  ) : (
                    <button
                      type="button"
                      onClick={()=>setShowSelect(!showSelect)} 

                      className="btn btn-warning btn-sm"
                    >
                      Select
                    </button>
                  )}
                  
              </div>

              <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
                
                {players.map((player:any, index:number) => {
                    return (
                      <div className='col-12 col-sm-12 col-md-4 col-xl-4' key={index}>
                          <div className="d-flex align-items-start">
                            {showSelect && (
                              <input
                                type="checkbox"
                                checked={selectedIds.has(player?.id)}
                                onChange={() => handleSelect(player?.id)}
                                className="me-2"
                              />
                            )}
                            <div className="w-100">
                              <PlayerCard player={player}
                              pageIndex={pageIndex}/>

                            </div>
                        </div>
                      </div>
                    )
                })}
            </div></>) :
            (<NoData title={"Player"} createUrl={"/player"}/>)}

            {players && <div
                style={{
                    display: "flex",
                    justifyContent: "center",
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
            disabled={ players?.length < 9 ? true : false }
            onClick={() => setPageIndex(pageIndex + 1)}
            className='bg-light'
            style={{
              marginLeft: "10px",
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
            Next
          </button>
        </div>}
        </>
    );
}

export default ViewAllPlayers;