import React, { useEffect, useState } from 'react';
import { getFoods, getFoodById, createFood, updateFood, deleteFood, uploadFoodImage, deleteFoodImage, type Food } from '@/api/food.api';

export default function AdminFoodsPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ name: '', story: '', ingredient: '', taste: '', style: '', comparison: '', region_id: '' });
  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    setLoading(true);
    try {
      const data = await getFoods('jp');
      setFoods(data);
      console.log("Loaded foods:", data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
    else setFile(null);
  }

  async function handleCreate() {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v as string); });
      if (file) fd.append('image', file);
      await createFood(fd);
      setForm({ name: '', story: '', ingredient: '', taste: '', style: '', comparison: '', region_id: '' });
      setFile(null);
      await loadFoods();
    } catch (e) { console.error(e); }
  }

  async function handleUpdate() {
    if (!editingId) return;
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v as string); });
      if (file) fd.append('image', file);
      await updateFood(editingId, fd);
      setEditingId(null);
      setForm({ name: '', story: '', ingredient: '', taste: '', style: '', comparison: '', region_id: '' });
      setFile(null);
      await loadFoods();
    } catch (e) { console.error(e); }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this food?')) return;
    try {
      await deleteFood(id);
      await loadFoods();
    } catch (e) { console.error(e); }
  }

  const [imagesMeta, setImagesMeta] = useState<{ food_image_id: number; image_url: string }[]>([]);

  async function startEdit(food: any) {
    setEditingId(food.food_id);
    setForm({ name: food.name || '', story: food.story || '', ingredient: food.ingredient || '', taste: food.taste || '', style: food.style || '', comparison: food.comparison || '', region_id: String(food.region_id || '') });

    // Fetch details to get images
    try {
      const detail = await getFoodById(String(food.food_id), 'jp');
      setImagesMeta(detail.images_meta || []);
    } catch (e) {
      console.error('Failed to load food images', e);
      setImagesMeta([]);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeleteImage(imageId: number) {
    if (!editingId) return;
    if (!confirm('Delete this image?')) return;
    try {
      await deleteFoodImage(editingId, imageId);
      // refresh images
      const detail = await getFoodById(String(editingId), 'jp');
      setImagesMeta(detail.images_meta || []);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUploadImage() {
    if (!editingId || !file) return;
    try {
      await uploadFoodImage(editingId, file);
      setFile(null);
      const detail = await getFoodById(String(editingId), 'jp');
      setImagesMeta(detail.images_meta || []);
    } catch (e) { console.error(e); }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Admin: Foods</h2>

      <div className="mb-6 p-4 border rounded">
        <h3 className="font-semibold mb-2">{editingId ? 'Edit food' : 'Create food'}</h3>
        <input name="name" placeholder="Name (Japanese)" value={form.name} onChange={onChange} className="w-full mb-2 p-2 border" />
        <textarea name="story" placeholder="Story" value={form.story} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input name="ingredient" placeholder="Ingredient" value={form.ingredient} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input name="taste" placeholder="Taste" value={form.taste} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input name="style" placeholder="Style" value={form.style} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input name="comparison" placeholder="Comparison" value={form.comparison} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input name="region_id" placeholder="Region ID" value={form.region_id} onChange={onChange} className="w-full mb-2 p-2 border" />
        <input type="file" onChange={onFileChange} className="mb-2" />
        {editingId && (
          <div className="mb-2">
            <button onClick={handleUploadImage} className="px-3 py-1 bg-indigo-600 text-white rounded mr-2">Upload Image</button>
            <span className="text-sm text-gray-500">Current images:</span>
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagesMeta.map((img) => (
                <div key={img.food_image_id} className="relative">
                  <img src={img.image_url} alt="" className="w-24 h-24 object-cover rounded" />
                  <button onClick={() => handleDeleteImage(img.food_image_id)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2">×</button>
                </div>
              ))}
            </div>
          </div>
        )}
        {!editingId ? (
          <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        ) : (
          <>
            <button onClick={handleUpdate} className="px-4 py-2 bg-green-600 text-white rounded mr-2">Update</button>
            <button onClick={() => { setEditingId(null); setForm({ name: '', story: '', ingredient: '', taste: '', style: '', comparison: '', region_id: '' }); setFile(null); setImagesMeta([]); }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          </>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">Foods ({loading ? 'loading...' : foods.length})</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Region</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((f) => (
              <tr key={f.food_id}>
                <td className="border p-2">{f.food_id}</td>
                <td className="border p-2">{f.name}</td>
                <td className="border p-2">{f.region_id}</td>
                <td className="border p-2">
                  <button onClick={() => startEdit(f)} className="mr-2 text-blue-600">Edit</button>
                  <button onClick={() => handleDelete(f.food_id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
