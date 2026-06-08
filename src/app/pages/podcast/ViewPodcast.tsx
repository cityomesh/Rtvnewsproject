import React, { useState, useEffect } from "react";
import client, { fetcher } from "../../modules/service/network";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Stack, Typography } from "@mui/material";
import { KTIcon } from "../../../_metronic/helpers";
import { toast } from "react-toastify";
import Shimmer from "../../common/shimmer/Shimmer";

export interface PodcastData {
    id: string,
    title: string,
    description: string,
    audioFileUrl: string,
    imageUrl: string,
    _links: any
  }

const ViewPodcast: React.FC = () => {
  const navigate = useNavigate();
  const [podcast, setPodcast] = useState<PodcastData[] | null>(null);
  const [loader, setLoader] = useState<boolean>(true);
  const fetch = async (page: number) => {
    try {
      const response = await client.get(`/podcast?page=${page}&size=20`);
      console.log(response.data);
      setPodcast(response.data._embedded.podcast);
      setLoader(false);
    } catch (error: any) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetch(0);
  }, []);

  const handleDelete = async (id: string)=> {
    try{
        console.log(id);
        const response = await client.delete(`/podcast/${id}`);
        toast.success("Delete successful");
        await fetch(0);
    }
    catch(err){
        console.log(err);
        toast.error("Failed to delete");
    }
  }   
 
  return (
    <>
        <PageTitle>
            Podcast
        </PageTitle>
        {loader ? <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
                <Shimmer />
            </div>:<div className="row pb-12">
        {podcast && podcast.map((element)=>{
            return <div className="col-4 mb-5">
                        <Card>
                            <CardHeader
                                title={element.title}
                                subheader="The best podcast ever"
                                action={
                                    <div className="d-flex gap-2">
                                        <a
                                        onClick={()=>{handleDelete(element._links.self.href.split("/").pop())}}
                                        className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline"
                                        style={{backgroundColor: '#FFFFFF00'}}
                                        >
                                            <KTIcon iconName='trash' className="fs-2 text-danger" />
                                        </a>
                                        <a
                                        onClick={()=>{
                                            navigate(`/podcast/create/${element._links.self.href.split("/").pop()}`);
                                        }}
                                        className="btn btn-bg-light btn-color-danger p-1 btn-icon btn-outline me-1"
                                        style={{backgroundColor: '#FFFFFF00'}}
                                        >
                                            <KTIcon iconName='pencil' className="fs-2 text-primary" />
                                        </a>
                                    </div>
                                }
                            />
                            <CardMedia
                                component="img"
                                height="194"
                                image={element.imageUrl}
                                alt="Podcast image"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: element.description }}
                                    />
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <Stack gap={1}>
                                <audio controls src={element.audioFileUrl}></audio>
                                </Stack>
                                
                            </CardActions>            
                        </Card>
                  </div>})    
        }
        </div>}
       
    </>
  );
};

export { ViewPodcast };