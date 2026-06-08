import React, {FC, useEffect, useState} from 'react'
import {
    ListsWidget1,
    ListsWidget2,
    ListsWidget3,
    ListsWidget4,
    ListsWidget5,
    ListsWidget6,
    ListsWidget7,
    ListsWidget8,
} from '../../../../_metronic/partials/widgets'
import {KTIcon, toAbsoluteUrl} from "../../../../_metronic/helpers";
import {Dropdown1} from "../../../../_metronic/partials";
import {MatchCard} from "../../../pages/matches/MatchCard.tsx";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import useSWR, {mutate} from "swr";
import client, {fetcher} from "../../service/network.ts";
import {toast} from "react-toastify";
import Shimmer from "../../../common/shimmer/Shimmer.tsx";
import NoData from '../../../common/nodata/NoData.tsx';
// import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import { Modal } from "../../../../_metronic/partials/widgets/modal/Modal.tsx"

type Props = {
}

const UpcomingMatchList: React.FC<Props> = () => {
    const [matches, setMatches] = useState<any[]>([])
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [pageIndex, setPageIndex] = useState(0);
    const [loader, setLoader] = useState<boolean>(true);
    const [totalPages, setTotalPages] = useState(0);
    const [id, setId] = useState("")

    const {data, error, isLoading} = useSWR(
        `/matches?page=${pageIndex}&size=9&sort=matchDate,desc`,
        fetcher,
        {
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (data) {
            setMatches(data._embedded?.matches || []);
            setTotalPages(data.page.totalPages)
            setLoader(false);
        }
        if (error) {
            enqueueSnackbar('Failed to fetch matches', {
                anchorOrigin: {vertical: 'top', horizontal: 'center'},
            });
        }
    }, [data, error]);

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
            const response = await client.delete(`/matches/${id}`)
            if (response.status === 200) {
                toast.success("Match Deleted!");
                mutate(`/matches?page=${pageIndex}&size=9&sort=matchDate,desc`);
            } else throw "404 response"
        } catch (err) {
            console.log(err)
            toast.error("Failed to delete match")
        }
    }

    // fetchMatches()
    return (
        <>
        {openModal && <Modal
          header="Delete Match?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{event: toggleModal, label: 'Cancel'}}
          action1={{event: ()=>{deleteMatch(id); toggleModal();}, label: "Delete"}}
          title="Match"
        />}
        <div className='card card-xl-stretch mb-xl-8'>
        {/* begin::Header */}
        <div className='card-header align-items-center border-0 mb-4'>
            <h3 className='card-title align-items-start flex-column'>
                <span className='fw-bold text-gray-900'>Recent Matches</span>
            </h3>
            
        </div>
        {/* end::Header */}
        {/* begin::Body */}
        {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>:
            matches.length > 0 ? <div className='row g-6 g-xl-9 mb-6 mb-xl-9 d-flex justify-content-center align-items-center' style={{ padding: '0px 20px' }}>
            {matches?.map((match: any, index: number) => (
            <div
              className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4 ml-1"
              key={index}
              style={{
                
              }}
            >
              <MatchCard
                match={match}
                button1={() => {
                  const newId = match._links.self.href.split('/').pop();
                  navigate(`/matches/create/${newId}`);
                }}
                button2={async () => {
                  const idToDelete = match._links.self.href.split('/').pop();
                  console.log(idToDelete);
                  setId(idToDelete);
                  toggleModal()
                //   await deleteMatch(idToDelete);
                }}
              />
            </div>
          ))}
        </div> : <div className=''><NoData title={"Match"} createUrl={"matches/create"}/></div>}


        
    </div>
    </>
    )
}

export {UpcomingMatchList}
