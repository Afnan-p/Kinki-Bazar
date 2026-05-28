import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSiteSettings, updateSiteSettings, resetSettingsUpdate } from '../../redux/slices/settingsSlice';
import toast from 'react-hot-toast';
import { FiSave, FiImage, FiLayout } from 'react-icons/fi';
import api from '../../utils/api';

const SiteSettings = () => {
  const dispatch = useDispatch();
  
  const { data, loading, updateLoading, updateSuccess, updateError } = useSelector((state) => state.settings);

  const [formData, setFormData] = useState({
    hero: {
      title: '', subtitle: '', description: '', image: '', ctaText: '', ctaLink: '',
      compImage: '', compBadge: '', compTitleTop: '', compTitleBottom: '', compLinkText: '', compLinkUrl: ''
    },
    anatomy: {
      title: '', subtitle: '', description: '', image: '', ratingText: '', ratingValue: '',
      box1Title: '', box1Desc: '', box2Title: '', box2Desc: ''
    },
    footer: {
      about: '', email: '', phone: '', address: '', facebook: '', instagram: '', twitter: '', youtube: ''
    },
    about: {
      title: '', subtitle: '', description: '', image: '', missionTitle: '', missionDesc: '', visionTitle: '', visionDesc: '', valuesTitle: '', valuesDesc: ''
    },
    contact: {
      title: '', subtitle: '', description: '', mapUrl: '', email: '', phone: '', address: ''
    }
  });

  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    dispatch(getSiteSettings());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setFormData({
        hero: { ...formData.hero, ...data.hero },
        anatomy: { ...formData.anatomy, ...data.anatomy },
        footer: { ...formData.footer, ...data.footer },
        about: { ...formData.about, ...data.about },
        contact: { ...formData.contact, ...data.contact }
      });
    }
  }, [data]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success('Site settings updated successfully!');
      dispatch(resetSettingsUpdate());
    }
    if (updateError) {
      toast.error(updateError);
      dispatch(resetSettingsUpdate());
    }
  }, [updateSuccess, updateError, dispatch]);

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleImageUpload = async (e, section, field) => {
    const file = e.target.files[0];
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      toast.loading('Uploading image...', { id: 'uploadImage' });
      const { data: uploadRes } = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.image?.url || uploadRes.url || uploadRes.secure_url;
      handleChange(section, field, imageUrl);
      toast.success('Image uploaded', { id: 'uploadImage' });
    } catch (err) {
      toast.error('Image upload failed', { id: 'uploadImage' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateSiteSettings(formData));
  };

  if (loading && !data) {
    return <div className="flex justify-center p-10"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const renderInput = (section, field, label, type="text", isTextarea=false) => (
    <div className="mb-4">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>
      {isTextarea ? (
        <textarea 
          value={formData[section][field]}
          onChange={(e) => handleChange(section, field, e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm h-32"
        />
      ) : (
        <input 
          type={type}
          value={formData[section][field]}
          onChange={(e) => handleChange(section, field, e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-sm"
        />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-[#071120] tracking-tighter">Site Settings</h2>
          <p className="text-gray-400 font-medium mt-1">Manage your homepage content and styling.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={updateLoading}
          className="flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          {updateLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <><FiSave /> <span>Save Changes</span></>
          )}
        </button>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex space-x-2 border-b border-gray-100 mb-6 pb-2 overflow-x-auto">
          {['hero', 'anatomy', 'about', 'contact', 'footer'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-bold text-sm capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {tab === 'about' ? 'Our Story' : tab === 'contact' ? 'Contact Us' : tab} Section
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          {activeTab === 'hero' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('hero', 'subtitle', 'Subtitle / Badge Text')}
                {renderInput('hero', 'title', 'Main Title')}
              </div>
              {renderInput('hero', 'description', 'Description', 'text', true)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('hero', 'ctaText', 'Button Text')}
                {renderInput('hero', 'ctaLink', 'Button Link')}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Background Image</label>
                <div className="flex items-end space-x-4">
                  <div className="flex-grow">
                    <input 
                      type="text"
                      value={formData.hero.image}
                      onChange={(e) => handleChange('hero', 'image', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="Image URL"
                    />
                  </div>
                  <label className="flex-shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center space-x-2">
                    <FiImage /> <span>Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero', 'image')} />
                  </label>
                </div>
                {formData.hero.image && (
                  <div className="mt-4 rounded-xl overflow-hidden h-40 relative group border border-gray-100 w-64">
                    <img src={formData.hero.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="mt-12 bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-6">
                <h4 className="font-bold text-lg text-gray-900 border-b border-gray-200 pb-2 mb-4">Floating Card Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInput('hero', 'compBadge', 'Card Badge Text')}
                  {renderInput('hero', 'compTitleTop', 'Card Title Top (White)')}
                  {renderInput('hero', 'compTitleBottom', 'Card Title Bottom (Primary Color)')}
                  {renderInput('hero', 'compLinkText', 'Card Link Text')}
                  {renderInput('hero', 'compLinkUrl', 'Card Link URL')}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Floating Card Image</label>
                  <div className="flex items-end space-x-4">
                    <div className="flex-grow">
                      <input 
                        type="text"
                        value={formData.hero.compImage}
                        onChange={(e) => handleChange('hero', 'compImage', e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                        placeholder="Image URL"
                      />
                    </div>
                    <label className="flex-shrink-0 cursor-pointer bg-white hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center space-x-2 border border-gray-100">
                      <FiImage /> <span>Upload</span>
                      <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'hero', 'compImage')} />
                    </label>
                  </div>
                  {formData.hero.compImage && (
                    <div className="mt-4 rounded-xl overflow-hidden h-40 relative group border border-gray-100 w-48">
                      <img src={formData.hero.compImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'anatomy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('anatomy', 'subtitle', 'Section Subtitle')}
                {renderInput('anatomy', 'title', 'Section Title')}
              </div>
              {renderInput('anatomy', 'description', 'Section Description', 'text', true)}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="col-span-1 md:col-span-2">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Rating Box (Left Floating)</h4>
                </div>
                {renderInput('anatomy', 'ratingText', 'Rating Subtitle')}
                {renderInput('anatomy', 'ratingValue', 'Rating Value')}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="col-span-1 md:col-span-2">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Feature Boxes</h4>
                </div>
                <div className="space-y-4">
                  {renderInput('anatomy', 'box1Title', 'Box 1 Title')}
                  {renderInput('anatomy', 'box1Desc', 'Box 1 Description')}
                </div>
                <div className="space-y-4">
                  {renderInput('anatomy', 'box2Title', 'Box 2 Title')}
                  {renderInput('anatomy', 'box2Desc', 'Box 2 Description')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Section Image</label>
                <div className="flex items-end space-x-4">
                  <div className="flex-grow">
                    <input 
                      type="text"
                      value={formData.anatomy.image}
                      onChange={(e) => handleChange('anatomy', 'image', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="Image URL"
                    />
                  </div>
                  <label className="flex-shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center space-x-2">
                    <FiImage /> <span>Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'anatomy', 'image')} />
                  </label>
                </div>
                {formData.anatomy.image && (
                  <div className="mt-4 rounded-xl overflow-hidden h-40 relative group border border-gray-100 w-64">
                    <img src={formData.anatomy.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="space-y-6 animate-fadeIn">
              {renderInput('footer', 'about', 'About Us (Footer Text)', 'text', true)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('footer', 'email', 'Contact Email')}
                {renderInput('footer', 'address', 'Address')}
              </div>
              <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4 mt-6">Social Links</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('footer', 'facebook', 'Facebook URL')}
                {renderInput('footer', 'instagram', 'Instagram URL')}
                {renderInput('footer', 'twitter', 'Twitter URL')}
                {renderInput('footer', 'youtube', 'Youtube URL')}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('about', 'subtitle', 'Subtitle / Tagline')}
                {renderInput('about', 'title', 'Main Title')}
              </div>
              {renderInput('about', 'description', 'Main Description', 'text', true)}
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Heritage Image</label>
                <div className="flex items-end space-x-4">
                  <div className="flex-grow">
                    <input 
                      type="text"
                      value={formData.about.image}
                      onChange={(e) => handleChange('about', 'image', e.target.value)}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary"
                      placeholder="Image URL"
                    />
                  </div>
                  <label className="flex-shrink-0 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-colors flex items-center space-x-2">
                    <FiImage /> <span>Upload</span>
                    <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, 'about', 'image')} />
                  </label>
                </div>
                {formData.about.image && (
                  <div className="mt-4 rounded-xl overflow-hidden h-40 relative group border border-gray-100 w-64">
                    <img src={formData.about.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Mission Box</h4>
                  {renderInput('about', 'missionTitle', 'Title')}
                  {renderInput('about', 'missionDesc', 'Description', 'text', true)}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Vision Box</h4>
                  {renderInput('about', 'visionTitle', 'Title')}
                  {renderInput('about', 'visionDesc', 'Description', 'text', true)}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Values Box</h4>
                  {renderInput('about', 'valuesTitle', 'Title')}
                  {renderInput('about', 'valuesDesc', 'Description', 'text', true)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInput('contact', 'subtitle', 'Subtitle / Tagline')}
                {renderInput('contact', 'title', 'Main Title')}
              </div>
              {renderInput('contact', 'description', 'Description', 'text', true)}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {renderInput('contact', 'email', 'Email Address')}
                {renderInput('contact', 'phone', 'Phone Number')}
                {renderInput('contact', 'address', 'Physical Address')}
              </div>

              <div className="mt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-2 mb-4">Google Map Embed</h4>
                  {renderInput('contact', 'mapUrl', 'Map iframe URL / Embed Link (src only)')}
                  <p className="text-xs text-gray-400 mt-[-10px] mb-4">Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy only the URL inside the src="..." attribute.</p>
                  
                  {formData.contact.mapUrl && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 h-64">
                      <iframe 
                        src={formData.contact.mapUrl}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SiteSettings;


