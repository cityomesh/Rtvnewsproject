// src/app/modules/trash/TrashPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PageTitle } from '../../../_metronic/layout/core';
import { KTIcon } from '../../../_metronic/helpers';
import { getTrashItems, restoreFromTrash, permanentDelete, TrashItem, ContentType } from '../service/trashService';
import { getCurrentUser } from '../auth/session';
import client from '../service/network';

const TrashPage: React.FC = () => {
  const [items, setItems] = useState<TrashItem[]>([]);
  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  const navigate = useNavigate();

  const loadTrash = () => {
    setItems(getTrashItems());
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (item: TrashItem) => {
    // Restore the item by making an API call to create/update it back
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      switch (item.type) {
        case 'news':
          await client.post(`/news?notify=false`, item.data, { headers });
          break;
        case 'quiz':
          await client.post(`/quiz?notify=false`, item.data, { headers });
          break;
        case 'post':
          await client.post(`/post?notify=false`, item.data, { headers });
          break;
        case 'poll':
          await client.post(`/poll?notify=false`, item.data, { headers });
          break;
        case 'reel':
          await client.post(`/reels?notify=false`, item.data, { headers });
          break;
      }
      // Remove from trash
      restoreFromTrash(item.id, item.type);
      toast.success(`${item.type} restored successfully!`);
      loadTrash();
      // Optionally navigate to the respective list page
      navigate(`/${item.type}s`);
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error('Failed to restore item');
    }
  };

  const handlePermanentDelete = (item: TrashItem) => {
    if (window.confirm(`Permanently delete this ${item.type}? This action cannot be undone.`)) {
      permanentDelete(item.id, item.type);
      toast.success(`${item.type} permanently deleted.`);
      loadTrash();
    }
  };

  const getTitle = (item: TrashItem): string => {
    switch (item.type) {
      case 'news': return item.data.title || 'Untitled News';
      case 'quiz': return item.data.questions?.[0]?.question || 'Untitled Quiz';
      case 'post': return item.data.title || 'Untitled Post';
      case 'poll': return item.data.question?.title || 'Untitled Poll';
      case 'reel': return item.data.title || 'Untitled Reel';
      default: return 'Item';
    }
  };

  return (
    <>
      <PageTitle description="" breadcrumbs={[]}>Trash</PageTitle>
      <div className="card mb-5 mb-xl-10">
        <div className="card-header border-0">
          <h3 className="fw-bolder m-0 my-5">Deleted Items (Trash)</h3>
        </div>
        <div className="card-body border-top p-9">
          {items.length === 0 ? (
            <p>Trash is empty. Deleted items will appear here.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-row-bordered table-row-gray-300 gy-5">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Title / Question</th>
                    <th>Deleted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={`${item.type}-${item.id}`}>
                      <td><span className="badge badge-light-primary">{item.type.toUpperCase()}</span></td>
                      <td>{getTitle(item)}</td>
                      <td>{new Date(item.deletedAt).toLocaleString()}</td>
                      <td>
                        <button className="btn btn-sm btn-icon btn-light me-2" onClick={() => handleRestore(item)} title="Restore">
                          <KTIcon iconName="arrow-left" className="fs-3 text-success" />
                        </button>
                        <button className="btn btn-sm btn-icon btn-light" onClick={() => handlePermanentDelete(item)} title="Permanently Delete">
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
          <button className="btn btn-secondary" onClick={loadTrash}>Refresh</button>
        </div>
      </div>
    </>
  );
};

export default TrashPage;
