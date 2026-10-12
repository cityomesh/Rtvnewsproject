import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KTIcon } from "../../../../_metronic/helpers";
import { PageTitle } from "../../../../_metronic/layout/core";
import { getCurrentUser } from "../../../modules/auth/session";

const getDraftsStorageKey = (): string => {
  const user = getCurrentUser();
  if (!user) return "news_drafts_anonymous";
  const identifier = user.username || "unknown";
  return `news_drafts_${identifier}`;
};

interface Draft {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  video: any;
  tags: string[];
  categoryType: string;
  district: string;
  createdAt: string;
  updatedAt: string;
}

const ViewDrafts: React.FC = () => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN"; // kept but not used for delete

  const loadDrafts = () => {
    const key = getDraftsStorageKey();
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
      const key = getDraftsStorageKey();
      const updated = drafts.filter((d) => d.id !== id);
      localStorage.setItem(key, JSON.stringify(updated));
      setDrafts(updated);
      toast.success("Draft deleted");
    }
  };

  const handleEdit = (draft: Draft) => {
    sessionStorage.setItem("editing_draft_id", draft.id);
    navigate(`/news/create?draftId=${draft.id}`);
  };

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>Drafts</PageTitle>
      <div className="card mb-5 mb-xl-10">
        <div className="card-header border-0">
          <h3 className="fw-bolder m-0 my-5">Local Drafts (not published)</h3>
        </div>
        <div className="card-body border-top p-9">
          {drafts.length === 0 ? (
            <p>No drafts found. Fill the news form and click "Save Draft" to store a draft locally.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-row-bordered table-row-gray-300 gy-5">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((draft) => (
                    <tr key={draft.id}>
                      <td>{draft.title || "Untitled"}</td>
                      <td>{new Date(draft.createdAt).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-icon btn-light me-2"
                          onClick={() => handleEdit(draft)}
                          title="Edit draft"
                        >
                          <KTIcon iconName="pencil" className="fs-3 text-primary" />
                        </button>
                        {/* Delete button for all users */}
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
          <button className="btn btn-primary" onClick={() => navigate("/news/create")}>Create New News</button>
        </div>
      </div>
    </>
  );
};

export default ViewDrafts;
