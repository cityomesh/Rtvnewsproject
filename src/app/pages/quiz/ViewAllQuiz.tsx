// import { useEffect, useState } from "react";
// import { PageTitle } from "../../../_metronic/layout/core";
// import client from "../../modules/service/network";
// import { toast } from "react-toastify";
// import { QuizCard } from "./QuizCard";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
// import NoData from "../../common/nodata/NoData";

// const PAGE_SIZE = 10;

// const ViewAllQuiz = () => {
//   const [queryParams, setQueryParams] = useState({ page: 0, size: PAGE_SIZE });
//   const [quizes, setQuizes] = useState<any[]>([]);
//   const [loader, setLoader] = useState(true);
//   const [activeId, setActiveId] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const navigate = useNavigate();

//   const toggleModal = () => {
//     setOpenModal(!openModal);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 500);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchQuizzes = async (page: number, query: string) => {
//     setLoader(true);
//     try {
//       const params: any = { page, size: PAGE_SIZE };
//       if (query.trim() !== "") {
//         params.query = query.trim();
//       }
//       const response = await client.get(`/quiz/search`, { params });
//       const data = response.data || [];
//       setQuizes(data);

//       // Set activeId to first active quiz id if any
//       const activeQuiz = data.find((q: any) => q.status === "ACTIVE");
//       setActiveId(activeQuiz?.id || "");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load quizzes");
//     } finally {
//       setLoader(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuizzes(queryParams.page, debouncedSearch);
//   }, [queryParams.page, debouncedSearch]);

//   const decrement = () => {
//     if (queryParams.page > 0) {
//       setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }));
//     }
//   };

//   const increment = () => {
//     if (quizes.length === PAGE_SIZE) {
//       setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
//     }
//   };

//   const deleteQuiz = async () => {
//     if (!itemToDelete) return;

//     try {
//       const response = await client.delete(`/quiz/${itemToDelete}`);
//       if (response.status === 200) {
//         toast.success("Quiz Deleted!");
//         toggleModal();
//         fetchQuizzes(queryParams.page, debouncedSearch);
//       } else {
//         throw new Error("Delete failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to Delete Quiz");
//     }
//   };

//   const handleDeleteClick = async (id: string) => {
//     setItemToDelete(id);
//     toggleModal();
//   };

//   return (
//     <div>
//       {openModal && (
//         <Modal
//           header="Delete Quiz?"
//           isOpen={openModal}
//           toggleDialog={toggleModal}
//           action2={{ event: toggleModal, label: "Cancel" }}
//           action1={{ event: deleteQuiz, label: "Delete" }}
//           title="Quiz"
//         />
//       )}

//       <div className="mb-4 d-flex justify-content-between align-items-center">
//         <h2>Quiz</h2>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search quiz..."
//           value={search}
//           onChange={(e) => {
//             setQueryParams((prev) => ({ ...prev, page: 0 }));
//             setSearch(e.target.value);
//           }}
//           style={{ width: "30%" }}
//         />
//       </div>

//       {loader ? (
//         <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
//           {/* Your shimmer loader component here */}
//           Loading...
//         </div>
//       ) : quizes.length === 0 ? (
//         // <div
//         //   style={{
//         //     marginTop: 40,
//         //     textAlign: "center",
//         //     fontSize: 18,
//         //     color: "#888",
//         //   }}
//         // >
//         //   No quizzes available.
//         // </div>
//         <div>
//           <NoData title={"More Quiz"} createUrl={"/quiz/create"}/>
//         </div>
//       ) : (
//         <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
//           {quizes.map((quiz) => {
//             const id = quiz.id;
//             return (
//               <div
//                 className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
//                 key={id}
//               >
//                 <QuizCard
//                   quiz={quiz}
//                   button1={() => {
//                     navigate(`/quiz/create/${id}`);
//                   }}
//                   button2={() => handleDeleteClick(id)}
//                   id={id}
//                   activeId={activeId}
//                   setActiveId={setActiveId}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginTop: 20,
//           marginBottom: 20,
//         }}
//       >
//         <button
//           disabled={queryParams.page === 0}
//           onClick={decrement}
//           className="bg-light"
//           style={{
//             marginRight: 10,
//             width: 100,
//             height: 40,
//             borderRadius: 20,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             cursor: "pointer",
//             border: "2px solid white",
//             padding: 10,
//             boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
//           }}
//         >
//           Previous
//         </button>

//         <button
//           disabled={quizes.length < PAGE_SIZE}
//           onClick={increment}
//           className="bg-light"
//           style={{
//             marginLeft: 10,
//             width: 100,
//             height: 40,
//             borderRadius: 20,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             cursor: "pointer",
//             border: "2px solid white",
//             padding: 10,
//             boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
//           }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewAllQuiz;




// import { useEffect, useState } from "react";
// import { PageTitle } from "../../../_metronic/layout/core";
// import client from "../../modules/service/network";
// import { toast } from "react-toastify";
// import { QuizCard } from "./QuizCard";
// import { useNavigate } from "react-router-dom";
// import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
// import NoData from "../../common/nodata/NoData";
// import { isAdmin, getCurrentUser} from "../../modules/auth/session";

// const PAGE_SIZE = 10;

// const ViewAllQuiz = () => {
//   const [queryParams, setQueryParams] = useState({ page: 0, size: PAGE_SIZE });
//   const [quizes, setQuizes] = useState<any[]>([]);
//   const [loader, setLoader] = useState(true);
//   const [activeId, setActiveId] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const navigate = useNavigate();

//   const currentUser = getCurrentUser();
//   const adminUser = isAdmin();

//   // Helper to get quiz creator from localStorage
//   const getQuizCreator = (quizId: string): string | null => {
//     const creatorsRaw = localStorage.getItem('quiz_creators');
//     if (!creatorsRaw) return null;
//     const creators = JSON.parse(creatorsRaw);
//     return creators[quizId] || null;
//   };

//   const toggleModal = () => {
//     setOpenModal(!openModal);
//   };

//   useEffect(() => {
//     const timer = setTimeout(() => setDebouncedSearch(search), 500);
//     return () => clearTimeout(timer);
//   }, [search]);

//   const fetchQuizzes = async (page: number, query: string) => {
//     setLoader(true);
//     try {
//       const params: any = { page, size: PAGE_SIZE };
//       if (query.trim() !== "") {
//         params.query = query.trim();
//       }
//       const response = await client.get(`/quiz/search`, { params });
//       const data = response.data || [];
//       setQuizes(data);
//       const activeQuiz = data.find((q: any) => q.status === "ACTIVE");
//       setActiveId(activeQuiz?.id || "");
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load quizzes");
//     } finally {
//       setLoader(false);
//     }
//   };

//   useEffect(() => {
//     fetchQuizzes(queryParams.page, debouncedSearch);
//   }, [queryParams.page, debouncedSearch]);

//   const decrement = () => {
//     if (queryParams.page > 0) {
//       setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }));
//     }
//   };

//   const increment = () => {
//     if (quizes.length === PAGE_SIZE) {
//       setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
//     }
//   };

//   const deleteQuiz = async () => {
//     if (!itemToDelete) return;
//     try {
//       const response = await client.delete(`/quiz/${itemToDelete}`);
//       if (response.status === 200) {
//         toast.success("Quiz Deleted!");
//         // Also remove from quiz_creators mapping
//         const creatorsRaw = localStorage.getItem('quiz_creators');
//         if (creatorsRaw) {
//           const creators = JSON.parse(creatorsRaw);
//           delete creators[itemToDelete];
//           localStorage.setItem('quiz_creators', JSON.stringify(creators));
//         }
//         toggleModal();
//         fetchQuizzes(queryParams.page, debouncedSearch);
//       } else {
//         throw new Error("Delete failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to Delete Quiz");
//     }
//   };

//   const handleDeleteClick = async (id: string) => {
//     setItemToDelete(id);
//     toggleModal();
//   };

//   return (
//     <div>
//       {openModal && (
//         <Modal
//           header="Delete Quiz?"
//           isOpen={openModal}
//           toggleDialog={toggleModal}
//           action2={{ event: toggleModal, label: "Cancel" }}
//           action1={{ event: deleteQuiz, label: "Delete" }}
//           title="Quiz"
//         />
//       )}

//       <div className="mb-4 d-flex justify-content-between align-items-center">
//         <h2>Quiz</h2>
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search quiz..."
//           value={search}
//           onChange={(e) => {
//             setQueryParams((prev) => ({ ...prev, page: 0 }));
//             setSearch(e.target.value);
//           }}
//           style={{ width: "30%" }}
//         />
//       </div>

//       {loader ? (
//         <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
//           <div className="text-center p-5">Loading quizzes...</div>
//         </div>
//       ) : quizes.length === 0 ? (
//         <NoData title={"More Quiz"} createUrl={"/quiz/create"} />
//       ) : (
//         <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
//           {quizes.map((quiz) => {
//             const id = quiz.id;
//             const creator = getQuizCreator(id);
//             // Show edit button only if admin OR current user is the creator
//             const canEdit = adminUser || (currentUser?.username === creator);
//             // Delete button only for admin
//             const canDelete = adminUser;
//             return (
//               <div
//                 className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
//                 key={id}
//               >
//                 <QuizCard
//                   quiz={quiz}
//                   button1={canEdit ? () => navigate(`/quiz/create/${id}`) : undefined}
//                   button2={canDelete ? () => handleDeleteClick(id) : undefined}
//                   id={id}
//                   activeId={activeId}
//                   setActiveId={setActiveId}
//                 />
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           marginTop: 20,
//           marginBottom: 20,
//         }}
//       >
//         <button
//           disabled={queryParams.page === 0}
//           onClick={decrement}
//           className="bg-light"
//           style={{
//             marginRight: 10,
//             width: 100,
//             height: 40,
//             borderRadius: 20,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             cursor: "pointer",
//             border: "2px solid white",
//             padding: 10,
//             boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
//           }}
//         >
//           Previous
//         </button>

//         <button
//           disabled={quizes.length < PAGE_SIZE}
//           onClick={increment}
//           className="bg-light"
//           style={{
//             marginLeft: 10,
//             width: 100,
//             height: 40,
//             borderRadius: 20,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             cursor: "pointer",
//             border: "2px solid white",
//             padding: 10,
//             boxShadow: "0px 2px 4px rgba(0,0,0,0.5)",
//           }}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ViewAllQuiz;







import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import client from "../../modules/service/network";
import { toast } from "react-toastify";
import { QuizCard } from "./QuizCard";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import NoData from "../../common/nodata/NoData";
import { isAdmin, getCurrentUser} from "../../modules/auth/session";

const PAGE_SIZE = 10;

const ViewAllQuiz = () => {
  const [queryParams, setQueryParams] = useState({ page: 0, size: PAGE_SIZE });
  const [quizes, setQuizes] = useState<any[]>([]);
  const [loader, setLoader] = useState(true);
  const [activeId, setActiveId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  const adminUser = isAdmin();
  const currentUser = getCurrentUser();
  const currentUsername = currentUser?.username || '';

  const [quizCreators, setQuizCreators] = useState<Record<string, string>>({});

  useEffect(() => {
    const stored = localStorage.getItem('quiz_creators');
    if (stored) {
      setQuizCreators(JSON.parse(stored));
    }
  }, []);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchQuizzes = async (page: number, query: string) => {
    setLoader(true);
    try {
      const params: any = { page, size: PAGE_SIZE };
      if (query.trim() !== "") {
        params.query = query.trim();
      }
      const response = await client.get(`/quiz/search`, { params });
      const data = response.data || [];
      setQuizes(data);
      const activeQuiz = data.find((q: any) => q.status === "ACTIVE");
      setActiveId(activeQuiz?.id || "");
    } catch (error) {
      console.error(error);
      toast.error("Failed to load quizzes");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchQuizzes(queryParams.page, debouncedSearch);
  }, [queryParams.page, debouncedSearch]);

  const decrement = () => {
    if (queryParams.page > 0) {
      setQueryParams((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const increment = () => {
    if (quizes.length === PAGE_SIZE) {
      setQueryParams((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const deleteQuiz = async () => {
    if (!itemToDelete) return;

    try {
      const response = await client.delete(`/quiz/${itemToDelete}`);
      if (response.status === 200) {
        toast.success("Quiz Deleted!");
        const updatedCreators = { ...quizCreators };
        delete updatedCreators[itemToDelete];
        localStorage.setItem('quiz_creators', JSON.stringify(updatedCreators));
        setQuizCreators(updatedCreators);
        toggleModal();
        fetchQuizzes(queryParams.page, debouncedSearch);
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to Delete Quiz");
    }
  };

  const handleDeleteClick = async (id: string) => {
    setItemToDelete(id);
    toggleModal();
  };

  const canEdit = (quizId: string): boolean => {
    if (adminUser) return true;
    const creator = quizCreators[quizId];
    return creator === currentUsername;
  };

  return (
    <div>
      {openModal && (
        <Modal
          header="Delete Quiz?"
          isOpen={openModal}
          toggleDialog={toggleModal}
          action2={{ event: toggleModal, label: "Cancel" }}
          action1={{ event: deleteQuiz, label: "Delete" }}
          title="Quiz"
        />
      )}

      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2>Quiz</h2>
        <input
          type="text"
          className="form-control"
          placeholder="Search quiz..."
          value={search}
          onChange={(e) => {
            setQueryParams((prev) => ({ ...prev, page: 0 }));
            setSearch(e.target.value);
          }}
          style={{ width: "30%" }}
        />
      </div>

      {loader ? (
        <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
          <div className="text-center p-5">Loading quizzes...</div>
        </div>
      ) : quizes.length === 0 ? (
        <NoData title={"More Quiz"} createUrl={"/quiz/create"} />
      ) : (
        <div className="row g-6 g-xl-9 mb-6 mb-xl-9">
          {quizes.map((quiz) => {
            const id = quiz.id;
            const showEdit = canEdit(id);
            return (
              <div
                className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                key={id}
              >
                <QuizCard
                  quiz={quiz}
                  button1={showEdit ? () => navigate(`/quiz/create/${id}`) : undefined}
                  button2={adminUser ? () => handleDeleteClick(id) : undefined}
                  showEdit={showEdit}
                  id={id}
                  activeId={activeId}
                  setActiveId={setActiveId}
                />
              </div>
            );
          })}
        </div>
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
          disabled={queryParams.page === 0}
          onClick={decrement}
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
          disabled={quizes.length < PAGE_SIZE}
          onClick={increment}
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
    </div>
  );
};

export default ViewAllQuiz;
