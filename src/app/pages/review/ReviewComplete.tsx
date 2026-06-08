import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import { enqueueSnackbar } from "notistack";

import client from "../../modules/service/network";
import RevVideoCard from "./RevVideoCard";
import Shimmer from "../../common/shimmer/Shimmer";
import NoData from "../../common/nodata/NoData";


const ReviewComplete = ()=>{
    const [revVideo, setRevVideo] = useState([]);
    const [loader, setLoader] = useState<boolean>(true);

    const fetchReels = async () => {
        
        try {
          const response = await client.get('training/review?reviewStatus=REVIEW_COMPLETE');
          setRevVideo(response.data);
          setLoader(false);

          
        } catch (err) {

          enqueueSnackbar('Failed to fetch Learning Videos', {
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          });
        }
    }
    
    
    useEffect(() => {
        fetchReels()
    }, [])
    return (
        <>
            <PageTitle description='' breadcrumbs={[]}>
                Review Complete
            </PageTitle>
            
            {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div> : 
            revVideo ? <div className='row g-6 g-xl-9 mb-6 mb-xl-9'>
                {revVideo.map((data, index) => {
                    
                    return (
                        <div className='col-12 col-sm-12 col-md-4 col-xl-4' key={index}>
                        
                            
                        <RevVideoCard data={data} /> 
                        </div>
                    )
                })}
            </div> : <div className=''><NoData title={"Review"} createUrl={"/review/underReview"}/></div> }
        </>
    );
}

export default ReviewComplete;