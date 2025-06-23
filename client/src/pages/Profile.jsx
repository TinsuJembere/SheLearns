import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user, logout, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setForm(user);
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) setForm(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value.split(',').map((v) => v.trim()).filter(Boolean) }));
  };

  const handleStatsChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, stats: { ...prev.stats, [name]: Number(value) } }));
  };

  const handleAchievementsChange = (i, field, value) => {
    setForm((prev) => {
      const achievements = [...(prev.achievements || [])];
      achievements[i] = { ...achievements[i], [field]: value };
      return { ...prev, achievements };
    });
  };

  const handleAddAchievement = () => {
    setForm((prev) => ({ ...prev, achievements: [...(prev.achievements || []), { title: '', date: '' }] }));
  };

  const handleRemoveAchievement = (i) => {
    setForm((prev) => {
      const achievements = [...(prev.achievements || [])];
      achievements.splice(i, 1);
      return { ...prev, achievements };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await axios.put('/api/profile', form);
      if (setUser) setUser(res.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await axios.post('/api/profile/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data && res.data.url) {
        setForm((prev) => ({ ...prev, avatar: res.data.url }));
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }
  
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  const isMentor = user.role === 'mentor';
  const editableFields = isMentor
    ? ['avatar', 'bio', 'skills', 'languages', 'expertise', 'stats', 'achievements']
    : ['avatar', 'bio'];

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <div className="max-w-7xl mx-auto w-full pt-8 pb-2 px-4 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Card */}
          <aside className="w-full md:w-1/4 bg-white rounded-xl shadow border border-gray-100 p-6 flex flex-col items-center">
            <div className="relative mb-3">
              {isEditing ? (
                <>
                  <img
                    src={form.avatar || '/avatar.jpg'}
                    alt={form.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-100 cursor-pointer"
                    onClick={handleAvatarClick}
                    style={{ opacity: uploading ? 0.5 : 1 }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-yellow-400 p-2 rounded-full shadow hover:bg-yellow-500 transition"
                    style={{ pointerEvents: uploading ? 'none' : 'auto' }}
                    onClick={handleAvatarClick}
                  >
                    <FiEdit2 className="text-white" size={18} />
                  </button>
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white bg-opacity-80 px-2 py-1 rounded text-xs text-yellow-700">Uploading...</span>
                    </div>
                  )}
                </>
              ) : (
                <img
                  src={user.avatar || '/avatar.jpg'}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-yellow-100"
                />
              )}
            </div>
            <div className="font-bold text-lg text-gray-900 mb-1">{user.name}</div>
            <div className="text-sm text-yellow-600 font-semibold mb-1 capitalize">{user.role}</div>
            <div className="text-xs text-gray-500 mb-2">{user.email}</div>
            {isEditing ? (
              <textarea
                name="bio"
                className="border rounded px-2 py-1 text-sm text-center mb-4 w-full"
                value={form.bio || ''}
                onChange={handleChange}
                placeholder="Bio"
              />
            ) : (
              <div className="text-gray-700 text-sm text-center mb-4">{user.bio}</div>
            )}
            {user.role === 'mentor' && user.stats && !isEditing && (
              <div className="flex justify-center gap-6 mb-4">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-yellow-600 text-lg">{user.stats.mentorships}</span>
                  <span className="text-xs text-gray-500">Mentees Connected</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-yellow-600 text-lg">{user.stats.students}</span>
                  <span className="text-xs text-gray-500">Hours Mentored</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-yellow-600 text-lg">{user.stats.projects}</span>
                  <span className="text-xs text-gray-500">Projects</span>
                </div>
              </div>
            )}
            {isEditing ? (
              <div className="flex flex-col gap-2 w-full mt-2">
                <button className="bg-yellow-400 text-white font-semibold px-4 py-2 rounded hover:bg-yellow-500 transition w-full" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={handleCancel} className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded hover:bg-gray-300 transition w-full">Cancel</button>
              </div>
            ) : (
              <button type="button" onClick={handleEdit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded hover:bg-gray-900 transition w-full mt-2">Edit Profile</button>
            )}
            <button onClick={handleLogout} className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition w-full mt-2">Logout</button>
          </aside>
          {/* Main Content */}
          <main className="w-full md:w-3/4 flex flex-col gap-6">
            {/* Skills & Languages */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 flex-1">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Skills</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="skills"
                    className="border rounded px-2 py-1 w-full"
                    value={form.skills ? form.skills.join(', ') : ''}
                    onChange={e => handleArrayChange('skills', e.target.value)}
                    placeholder="Comma separated skills"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? user.skills.map((skill, i) => (
                      <span key={i} className="bg-yellow-100 text-yellow-700 font-semibold px-3 py-1 rounded-full text-sm">{skill}</span>
                    )) : <span className="text-gray-400">No skills listed.</span>}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-xl shadow border border-gray-100 p-6 flex-1">
                <h3 className="font-bold text-lg mb-3 text-gray-800">Languages</h3>
                {isEditing ? (
                  <input
                    type="text"
                    name="languages"
                    className="border rounded px-2 py-1 w-full"
                    value={form.languages ? form.languages.join(', ') : ''}
                    onChange={e => handleArrayChange('languages', e.target.value)}
                    placeholder="Comma separated languages"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.languages && user.languages.length > 0 ? user.languages.map((lang, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">{lang}</span>
                    )) : <span className="text-gray-400">No languages listed.</span>}
                  </div>
                )}
              </div>
            </div>
            {/* Bio */}
            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-3 text-gray-800">Bio</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  className="border rounded px-2 py-1 w-full"
                  value={form.bio || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                />
              ) : (
                <div className="text-gray-700 text-sm whitespace-pre-line">{user.bio || 'No bio provided.'}</div>
              )}
            </div>
            {/* Mentor-only sections */}
            {user.role === 'mentor' && (
              <>
                {/* Mentor Expertise Areas */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Mentor Expertise Areas</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      name="expertise"
                      className="border rounded px-2 py-1 w-full"
                      value={form.expertise ? form.expertise.join(', ') : ''}
                      onChange={e => handleArrayChange('expertise', e.target.value)}
                      placeholder="Comma separated expertise areas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.expertise && user.expertise.length > 0 ? user.expertise.map((expert, i) => (
                        <span key={i} className="bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full text-sm">{expert}</span>
                      )) : <span className="text-gray-400">No expertise areas listed.</span>}
                    </div>
                  )}
                </div>
                {/* Achievements & Certifications */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Achievements & Certifications</h3>
                  {isEditing ? (
                    <div className="flex flex-col gap-2">
                      {(form.achievements || []).map((ach, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Title"
                            className="border rounded px-2 py-1 w-1/2"
                            value={ach.title || ''}
                            onChange={e => handleAchievementsChange(i, 'title', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Date"
                            className="border rounded px-2 py-1 w-1/2"
                            value={ach.date || ''}
                            onChange={e => handleAchievementsChange(i, 'date', e.target.value)}
                          />
                          <button type="button" onClick={() => handleRemoveAchievement(i)} className="text-red-500">Remove</button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddAchievement} className="text-yellow-500 mt-2">Add Achievement</button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside text-gray-700">
                      {user.achievements && user.achievements.length > 0 ? user.achievements.map((ach, i) => (
                        <li key={i}><strong>{ach.title}</strong>{ach.date ? ` - ${ach.date}` : ''}</li>
                      )) : <span className="text-gray-400">No achievements listed.</span>}
                    </ul>
                  )}
                </div>
                {/* Mentor Stats Editing */}
                <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-800">Mentor Stats</h3>
                  {isEditing ? (
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center flex-1">
                        <label className="text-xs text-gray-500 mb-1">Mentees Connected</label>
                        <input
                          type="number"
                          name="mentorships"
                          className="border rounded px-2 py-1 w-full text-center"
                          value={form.stats?.mentorships || 0}
                          onChange={e => handleStatsChange({ target: { name: 'mentorships', value: e.target.value } })}
                        />
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <label className="text-xs text-gray-500 mb-1">Hours Mentored</label>
                        <input
                          type="number"
                          name="students"
                          className="border rounded px-2 py-1 w-full text-center"
                          value={form.stats?.students || 0}
                          onChange={e => handleStatsChange({ target: { name: 'students', value: e.target.value } })}
                        />
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <label className="text-xs text-gray-500 mb-1">Projects</label>
                        <input
                          type="number"
                          name="projects"
                          className="border rounded px-2 py-1 w-full text-center"
                          value={form.stats?.projects || 0}
                          onChange={e => handleStatsChange({ target: { name: 'projects', value: e.target.value } })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center gap-6 mb-4">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-yellow-600 text-lg">{user.stats.mentorships}</span>
                        <span className="text-xs text-gray-500">Mentees Connected</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-yellow-600 text-lg">{user.stats.students}</span>
                        <span className="text-xs text-gray-500">Hours Mentored</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-yellow-600 text-lg">{user.stats.projects}</span>
                        <span className="text-xs text-gray-500">Projects</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile; 