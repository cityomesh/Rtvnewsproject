import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { KTIcon } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import { getCurrentUser } from "../../modules/auth/session";

const DRAFTS_STORAGE_KEY = "post_drafts";

interface DraftPost {
  id: string;
  title: string;
  description: string;
  bannerImage: string | null;
  video: any;
  createdAt: string;
  updatedAt: string;
}

const ViewPostDrafts: React.FC = () => {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === "ADMIN";

  const loadDrafts = () => {
    const stored = localStorage.getItem(DRAFTS_STORAGE_KEY);
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
    if (!isAdmin) {
      toast.error("Only admin users can delete drafts");
      return;
    }
    if (window.confirm("Delete this draft?")) {
      const updated = drafts.filter((d) => d.id !== id);
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(updated));
      setDrafts(updated);
      toast.success("Draft deleted");
    }
  };

  const handleEdit = (draft: DraftPost) => {
    sessionStorage.setItem("editing_post_draft_id", draft.id);
    navigate(`/post/create?draftId=${draft.id}`);
  };

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>Post Drafts</PageTitle>
      <div className="card mb-5 mb-xl-10">
        <div className="card-header border-0">
          <h3 className="fw-bolder m-0 my-5">Local Post Drafts (not published)</h3>
        </div>
        <div className="card-body border-top p-9">
          {drafts.length === 0 ? (
            <p>No post drafts found. Create a post and click "Save Draft" to store a draft locally.</p>
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
                        {isAdmin && (
                          <button
                            className="btn btn-sm btn-icon btn-light"
                            onClick={() => handleDelete(draft.id)}
                            title="Delete draft"
                          >
                            <KTIcon iconName="trash" className="fs-3 text-danger" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="card-footer d-flex justify-content-end py-6 px-9">
          <button className="btn btn-primary" onClick={() => navigate("/post/create")}>
            Create New Post
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewPostDrafts;
