export type ContentType = 'news' | 'quiz' | 'post' | 'poll' | 'reel';

export interface TrashItem {
  id: string;
  type: ContentType;
  data: any;
  deletedAt: string;
  deletedBy: string;
}

const TRASH_STORAGE_KEY = 'app_trash';

export const getTrashItems = (): TrashItem[] => {
  const stored = localStorage.getItem(TRASH_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveTrashItems = (items: TrashItem[]) => {
  localStorage.setItem(TRASH_STORAGE_KEY, JSON.stringify(items));
};

export const moveToTrash = (item: { id: string; type: ContentType; data: any }, username: string) => {
  const trash = getTrashItems();
  if (!trash.some(t => t.id === item.id && t.type === item.type)) {
    trash.push({
      id: item.id,
      type: item.type,
      data: item.data,
      deletedAt: new Date().toISOString(),
      deletedBy: username,
    });
    saveTrashItems(trash);
  }
};

export const restoreFromTrash = (id: string, type: ContentType): any | null => {
  const trash = getTrashItems();
  const index = trash.findIndex(t => t.id === id && t.type === type);
  if (index !== -1) {
    const item = trash[index];
    trash.splice(index, 1);
    saveTrashItems(trash);
    return item.data;
  }
  return null;
};

export const permanentDelete = (id: string, type: ContentType) => {
  const trash = getTrashItems();
  const updated = trash.filter(t => !(t.id === id && t.type === type));
  saveTrashItems(updated);
};

export const isInTrash = (id: string, type: ContentType): boolean => {
  return getTrashItems().some(t => t.id === id && t.type === type);
};
