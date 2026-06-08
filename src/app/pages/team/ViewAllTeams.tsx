import {useEffect, useState} from "react";
import {PageTitle} from "../../../_metronic/layout/core";
import client, { fetcher } from "../../modules/service/network";
import useSWR, { mutate } from "swr";
import {useSnackbar} from "notistack";
import {TeamCard} from "./TeamCard.tsx";
import {useNavigate} from "react-router-dom";
import Shimmer from "../../common/shimmer/Shimmer.tsx";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import NoData from "../../common/nodata/NoData.tsx";
import Pagination from "../../common/pagination/Pagination.tsx";

const ViewAllTeams = () => {
  const [teams, setTeams] = useState<any[]>([])
  const {enqueueSnackbar, closeSnackbar} = useSnackbar();
  const [id, setId] = useState("")
  const [pageIndex, setPageIndex] = useState(0)
  const [totalPages, setTotalPages] = useState(0); 
  const [loader, setLoader] = useState<boolean>(true);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
    const toggleModal = ()=>{
        setOpenModal(!openModal);
  }

  const fetchTeams = async () => {
    const { data, error, isLoading } = useSWR(`/team?page=${pageIndex}&size=20`, fetcher, {
      onSuccess: (data, key, config) => {
          setTeams(data?._embedded.team)
        setTotalPages(data?.page?.totalPages);
        setLoader(false);
      },
    });
    if (error) enqueueSnackbar('Failed to fetch Details', {
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
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

  const deleteTeam = async (id: string) => {
    try {
      const response = await client.delete(`/team/${id}`)
      if (response.status === 200) {
        enqueueSnackbar('Deleted Team', {
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          
        });
        await mutate(`/team?page=${pageIndex}&size=20`)
      } else throw "404 response"
    } catch (err) {
      console.log(err)
      enqueueSnackbar('Failed to delete team', {
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      });
    }
  }

  fetchTeams()
  // useEffect(() => {
  //   fetchTeams()
  // }, [])
  return (
      <div>
        {openModal && <Modal 
        header="Delete Team?"
        isOpen={openModal}
        toggleDialog={toggleModal}
        action2={{event: toggleModal, label: 'Cancel'}}
        action1={{event: ()=>{deleteTeam(id); toggleModal();}, label: "Delete"}}
        title="Team"
        />}

        <PageTitle description='' breadcrumbs={[]}>
          Teams
        </PageTitle>
        {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div> : 
          teams ? 
          <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
          {teams.map((team, index) => {
            return (
                <div className='col-12 col-sm-12 col-md-4 col-xl-3 mb-2' key={team._links.self.href}>
                  <TeamCard
                      team={team}
                      button1={() => {
                        const newId = team._links.self.href.split("/").pop();
                        navigate(`/team/create/${newId}`);
                      }}
                      button2={async () => {
                        
                        toggleModal()
                        setId(team._links.self.href.split("/").pop());
                        // await fetchTeams()
                      }}
                  />
                </div>
            )
          })}
        </div> : <div className=''><NoData title={"Team"} createUrl={"/team/create"}/></div>}

        

        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPrevious={() => setPageIndex(pageIndex - 1)}
          onNext={() => setPageIndex(pageIndex + 1)}
        />
            
      </div>
  );
};

export default ViewAllTeams;