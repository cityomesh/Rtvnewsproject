import { useEffect, useState } from "react";
import { PageTitle } from "../../../_metronic/layout/core";
import client from "../../modules/service/network";
import { toast } from "react-toastify";
import { QuizCard } from "./QuizCard";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../_metronic/partials/widgets/modal/Modal";
import NoData from "../../common/nodata/NoData";
import { isAdmin, getCurrentUser} from "../../modules/auth/session";
import { moveToTrash, isInTrash } from "../../modules/service/trashService";   // ✅ import trash service

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
      let data = response.data || [];
      
      // ✅ Filter out quizzes that are in trash
      data = data.filter((quiz: any) => !isInTrash(quiz.id, 'quiz'));
      
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

  // ✅ Updated delete: move to trash + API delete
  const deleteQuiz = async () => {
    if (!itemToDelete) return;

    // Find the quiz item to be deleted
    const quizToDelete = quizes.find(q => q.id === itemToDelete);
    if (!quizToDelete) return;

    const currentUserObj = getCurrentUser();
    if (!currentUserObj) return;

    try {
      // 1. Move to Trash (localStorage)
      moveToTrash({
        id: itemToDelete,
        type: 'quiz',
        data: quizToDelete,
      }, currentUserObj.username);

      // 2. Delete from server (API)
      const response = await client.delete(`/quiz/${itemToDelete}`);
      if (response.status === 200) {
        toast.success("Quiz moved to trash and deleted from server!");
        
        // 3. Remove from quiz_creators mapping
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
      toast.error("Failed to delete quiz");
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
