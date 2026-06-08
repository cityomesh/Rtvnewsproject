import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material/";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import client from "../../modules/service/network";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";
const AllTutorials: React.FC = () => {
  interface TutorialsData {
    id: string,
    topic: string,
    content: string,
    sourceUrl: string,
    imageUrl: {
      path: string
    },
    videoUrl: {
      path: string
    },
    category: string,
    createdAt: string,
    updatedAt: string
  }

  const findDateTime = (timestamp: string): [string, string] => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return [formattedDate, formattedTime];
  };
  const navigate = useNavigate();
  const [tutorialElement, setTutorialElement] = useState<TutorialsData[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const notify = (message: any) => toast.error(message);
  const [tutorialId, setTutorialId] = useState("");
  const [queryParams, setQueryParams] = useState({ page: 0, size: 9 });
  const fetch = async (page: number) => {
    try {
      const response = await client.get(`/tutorials`, {
        params: { ...queryParams, page },
      });
      setTutorialElement(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch(queryParams.page);
  }, [queryParams.page]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDeleteAndClose = (idToDelete: any) => {
    client
      .delete(`tutorials/${idToDelete}`)
      .then((response) => {
        toast.success("Tutorial deleted successfully!");
        fetch(queryParams.page);
      })
      .catch((error) => {
        console.error("Error deleting tutorial:", error);
      })
      .finally(() => {
        handleClose();
      });
  };

  const handleCreateForm = async (tutorialItem: any, id: string) => {
    const newId = tutorialItem.id;
    await setTutorialId(newId);
    navigate(`/tutorials/create/${newId}`);
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Tutorial</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this tutorial?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDeleteAndClose(id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        {tutorialElement.length>0 && tutorialElement.map(
          (tutorialItem: TutorialsData, index: number) => (
            <div
              key={tutorialItem.id}
              className="col-lg-6 mb-5"
            >
              <a
                href={tutorialItem.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`card`}
              >
                {/* begin::Body */}
                <div className="card-body pb-0">
                  {/* begin::Header */}
                  <div className="d-flex align-items-center mb-5">
                    {/* begin::User */}
                    <div className="d-flex align-items-center flex-grow-1">
                      {/* begin::Info */}
                      <div className="d-flex flex-column">
                        <a
                          href="#"
                          className="text-gray-800 text-hover-primary fs-6 fw-bold"
                        >
                          {tutorialItem.topic}
                        </a>

                        <span className="text-gray-500 fw-semibold">
                          {findDateTime(tutorialItem.updatedAt)[0]} |{" "}
                          {findDateTime(tutorialItem.updatedAt)[1]}
                        </span>
                      </div>
                      {/* end::Info */}
                    </div>
                    {/* end::User */}
                  </div>
                  {/* end::Header */}

                  {/* begin::Post */}
                  <div className="mb-5">
                    {/* begin::Text */}
                    <p className="text-gray-800 fw-normal mb-5">
                      {parse(tutorialItem.content)}
                    </p>

                    {/* begin::Image */}
                    {tutorialItem.imageUrl && (
                      <div
                        className="bgi-no-repeat rounded min-h-250px mb-5"
                        style={{
                          backgroundImage: `url(${tutorialItem.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      ></div>
                    )}
                    {/* end::Image */}

                    {tutorialItem.videoUrl && (
                    <div className="bgi-no-repeat rounded min-h-250px mb-5">
                      <video
                        controls
                        title="Preview of Uploaded Video"
                        className="rounded h-300px w-100"
                        src={tutorialItem.videoUrl.path}
                      ></video>
                    </div>
                    )}


                    {/* end::Text */}

                    {/* begin::Toolbar */}
                    <div className="d-flex align-items-center mb-5">
                      <a
                        href="#"
                        className="btn btn-sm btn-light btn-color-muted btn-active-light-success px-4 py-2 me-4"
                        onClick={async () => {
                          await handleCreateForm(tutorialItem, tutorialItem.id);
                        }}
                      >
                        <span
                          className="ki-duotone ki-pencil"
                          style={{ fontSize: "20px" }}
                        >
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </span>
                      </a>

                      <a
                        href="#"
                        className="btn btn-sm btn-light btn-color-muted btn-active-light-danger px-4 py-2"
                        onClick={() => {
                          handleShow();
                          setId(tutorialItem.id);
                        }}
                      >
                        <span
                          className="ki-duotone ki-trash"
                          style={{ fontSize: "20px" }}
                        >
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span>
                        </span>
                      </a>
                    </div>
                    {/* end::Toolbar */}
                  </div>
                  {/* end::Post */}
                </div>
                {/* end::Body */}
              </a>
            </div>
          )
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <button
          disabled={queryParams.page === 0 ? true : false}
          onClick={()=>{}}
          style={{
            marginRight: "10px",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            backgroundColor: "white",
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
          disabled={
            queryParams.page === 0
              ? true
              : false
          }
          onClick={()=>{}}
          style={{
            marginLeft: "10px",
            width: "100px",
            height: "40px",
            borderRadius: "20px",
            backgroundColor: "white",
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
      </div>
    </>
  );
};

export { AllTutorials };
