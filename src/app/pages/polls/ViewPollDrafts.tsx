import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KTIcon } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import { getCurrentUser } from "../../modules/auth/session";

const getPollDraftsStorageKey = (): string => {
  const user = getCurrentUser();
  if (!user) return "poll_drafts_anonymous";
  const identifier = user.username || "unknown";
  return `poll_drafts_${identifier}`;
};

interface DraftPoll {
  id: string;
  question: { title: string; options: any[] };
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

const ViewPollDrafts: React.FC = () => {
  const [drafts, setDrafts] = useState<DraftPoll[]>([]);
  const navigate = useNavigate();

  const loadDrafts = () => {
    const key = getPollDraftsStorageKey();
    const stored = localStorage.getItem(key);
    if (stored) {
      setDrafts(JSON.parse(stored));
    } else {
      setDrafts([]);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this draft?")) {
      const key = getPollDraftsStorageKey();
      const updated = drafts.filter((d) => d.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      setDrafts(updated);
      toast.success("Draft deleted");
    }
  };

  const handleEdit = (draft: DraftPoll) => {
    sessionStorage.setItem("editing_poll_draft_id", draft.id);
    navigate(`/poll/create?draftId=${draft.id}`);
  };

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>Poll Drafts</PageTitle>
      <div className="card mb-5 mb-xl-10">
        <div className="card-header border-0">
          <h3 className="fw-bolder m-0 my-5">Local Poll Drafts (not published)</h3>
        </div>
        <div className="card-body border-top p-9">
          {drafts.length === 0 ? (
            <p>No poll drafts found. Create a poll and click "Save Draft" to store a draft locally.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-row-bordered table-row-gray-300 gy-5">
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((draft) => (
                    <tr key={draft.id}>
                      <td>{draft.question.title || "Untitled"}</td>
                      <td>{new Date(draft.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-icon btn-light me-2"
                          onClick={() => handleEdit(draft)}
                          title="Edit draft"
                        >
                          <KTIcon iconName="pencil" className="fs-3 text-primary" />
                        </button>
                        <button
                          className="btn btn-sm btn-icon btn-light"
                          onClick={() => handleDelete(draft.id)}
                          title="Delete draft"
                        >
                          <KTIcon iconName="trash" className="fs-3 text-danger" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          <button className="btn btn-primary" onClick={() => navigate("/poll/create")}>Create New Poll</button>
        </div>
      </div>
    </>
  );
};

export default ViewPollDrafts;
