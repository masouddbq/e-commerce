import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, uploadProductImage, deleteProductImage, uploadBrandImage, deleteBrandImage } from "../../lib/supabase";
import BackupManager from './BackupManager';
import PriceEditor from './PriceEditor';
import { formatPriceWithUnit } from "../../lib/utils";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'brands', 'price-editor', 'backup'
  
  // SEO: اضافه کردن Meta Tag noindex برای جلوگیری از ایندکس شدن صفحه Admin
  useEffect(() => {
    // بررسی وجود meta tag قبلی
    let existingMeta = document.querySelector('meta[name="robots"]');
    
    // ذخیره مقدار قبلی برای بازگردانی هنگام unmount
    let previousContent = 'index, follow'; // مقدار پیش‌فرض از index.html
    
    if (existingMeta) {
      previousContent = existingMeta.getAttribute('content') || 'index, follow';
    } else {
      // اگر وجود ندارد، ایجاد کن
      existingMeta = document.createElement('meta');
      existingMeta.setAttribute('name', 'robots');
      document.head.appendChild(existingMeta);
    }
    
    // تنظیم محتوا به noindex, nofollow
    existingMeta.setAttribute('content', 'noindex, nofollow');
    
    // Cleanup: وقتی کامپوننت unmount می‌شود، meta tag را به حالت اولیه برگردان
    return () => {
      const metaTag = document.querySelector('meta[name="robots"]');
      if (metaTag) {
        metaTag.setAttribute('content', previousContent);
      }
    };
  }, []);
  
  // State برای مدیریت برندها و دسته‌بندی‌ها
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [showAddPadBrandForm, setShowAddPadBrandForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingPadBrand, setEditingPadBrand] = useState(null);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", image: "" });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [newPadBrand, setNewPadBrand] = useState({ name: "", description: "" });
  const [addingBrand, setAddingBrand] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingPadBrand, setAddingPadBrand] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [deletingPadBrand, setDeletingPadBrand] = useState(false);
  const [showDeleteBrandConfirm, setShowDeleteBrandConfirm] = useState(null);
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(null);
  const [showDeletePadBrandConfirm, setShowDeletePadBrandConfirm] = useState(null);

  // State های جدید برای مدیریت تصاویر برندها
  const [selectedBrandImage, setSelectedBrandImage] = useState(null);
  const [brandImagePreview, setBrandImagePreview] = useState(null);
  const [editingBrandImage, setEditingBrandImage] = useState(null);
  const [uploadingBrandImage, setUploadingBrandImage] = useState(false);
  const [showBrandImageModal, setShowBrandImageModal] = useState(false);
  const [selectedBrandForImage, setSelectedBrandForImage] = useState(null);
  
  // State برای نمایش لیست برندهای موجود
  const [showExistingBrands, setShowExistingBrands] = useState(false);

  // --- Brand CRUD ---
  const handleAddBrand = async () => {
    try {
      if (!newBrand.name.trim()) return alert('نام برند الزامی است');
      setAddingBrand(true);
      
      // بررسی وجود برند با همین نام
      const { data: existingBrand, error: checkError } = await supabase
        .from('brands')
        .select('id, name')
        .eq('name', newBrand.name.trim())
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingBrand) {
        alert(`برند "${newBrand.name.trim()}" قبلاً در سیستم وجود دارد. لطفاً نام دیگری انتخاب کنید.`);
        return;
      }
      
      // ابتدا برند را بدون عکس اضافه کن
      console.log('Adding brand:', newBrand.name.trim());
      
      // روش اول: استفاده از select
      let { data, error } = await supabase.from('brands').insert([{ 
        name: newBrand.name.trim(), 
        description: newBrand.description || `برند ${newBrand.name.trim()}`,
        image: ""
      }]).select('id, name, description, image');
      
      console.log('Insert result with select - data:', data, 'error:', error);
      
      if (error) throw error;
      
      // بررسی وجود data و id
      let brandId;
      if (data && data[0] && data[0].id) {
        brandId = data[0].id;
        console.log('Brand ID from insert result:', brandId);
      } else {
        // اگر data برگردانده نشد، برند را جستجو کن
        console.log('Data not returned from insert, searching for brand...');
        const { data: searchData, error: searchError } = await supabase
          .from('brands')
          .select('id')
          .eq('name', newBrand.name.trim())
          .single();
        
        if (searchError || !searchData || !searchData.id) {
          console.error('Data received from insert:', data);
          console.error('Search error:', searchError);
          
          // روش آخر: تلاش برای دریافت آخرین برند اضافه شده
          console.log('Trying to get the last inserted brand...');
          const { data: lastBrandData, error: lastBrandError } = await supabase
            .from('brands')
            .select('id, name')
            .order('id', { ascending: false })
            .limit(1)
            .single();
          
          if (lastBrandError || !lastBrandData || lastBrandData.name !== newBrand.name.trim()) {
            throw new Error('خطا در دریافت شناسه برند جدید');
          }
          
          brandId = lastBrandData.id;
          console.log('Brand ID found via last inserted:', brandId);
        } else {
          brandId = searchData.id;
          console.log('Brand ID found via search:', brandId);
        }
      }
      
      // اگر عکس انتخاب شده، آن را آپلود کن
      if (selectedBrandImage) {
        const imageUrl = await uploadBrandImageToStorage(brandId);
        if (imageUrl) {
          // برند را با عکس بروزرسانی کن
          const { error: updateError } = await supabase
            .from('brands')
            .update({ image: imageUrl })
            .eq('id', brandId);
          
          if (updateError) {
            throw updateError;
          }
          
          console.log(`تصویر برند جدید ${brandId} در دیتابیس ذخیره شد:`, imageUrl);
        }
      }
      
      setDefaultBrands([...defaultBrands, { 
        id: brandId, 
        name: newBrand.name.trim(), 
        description: newBrand.description || `برند ${newBrand.name.trim()}`,
        image: ""
      }]);
      setNewBrand({ name: '', description: '', image: '' });
      clearBrandImageSelection();
      alert('برند اضافه شد');
    } catch (e) { 
      console.error('Error adding brand:', e);
      alert('خطا در افزودن برند: ' + (e?.message || 'خطای نامشخص'));
    } finally { 
      setAddingBrand(false); 
    }
  };

  // تابع برای آپلود تصویر برند
  const uploadBrandImageToStorage = async (brandId) => {
    if (!selectedBrandImage) return null;
    
    try {
      setUploadingBrandImage(true);
      
      // ایجاد نام فایل منحصر به فرد
      const fileExtension = selectedBrandImage.name.split('.').pop().toLowerCase();
      const fileName = `brand-${brandId}-${Date.now()}.${fileExtension}`;
      
      // آپلود به Supabase Storage
      const { data, error } = await supabase.storage
        .from('brand-images')
        .upload(fileName, selectedBrandImage);
      
      if (error) throw error;
      
      // دریافت URL عمومی
      const { data: { publicUrl } } = supabase.storage
        .from('brand-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading brand image:', error);
      alert('خطا در آپلود تصویر برند: ' + error.message);
      return null;
    } finally {
      setUploadingBrandImage(false);
    }
  };

  // تابع برای انتخاب تصویر برند
  const handleBrandImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedBrandImage(file);
      
      // ایجاد preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBrandImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // تابع برای پاک کردن انتخاب تصویر برند
  const clearBrandImageSelection = () => {
    setSelectedBrandImage(null);
    setBrandImagePreview(null);
    setNewBrand({...newBrand, image: ""});
    setEditingBrandImage(null);
  };

  // تابع برای مدیریت تصویر برند موجود
  const handleBrandImageManagement = (brand) => {
    setSelectedBrandForImage(brand);
    setShowBrandImageModal(true);
  };

  // تابع برای آپلود تصویر جدید برای برند موجود
  const handleUpdateBrandImage = async (brandId, imageFile) => {
    try {
      setUploadingBrandImage(true);
      
      // حذف تصویر قدیمی
      const oldBrand = defaultBrands.find(b => b.id === brandId);
      if (oldBrand && oldBrand.image) {
        try {
          const oldImagePath = oldBrand.image.split('/').pop();
          await supabase.storage
            .from('brand-images')
            .remove([oldImagePath]);
        } catch (error) {
          console.warn('Could not delete old image:', error);
        }
      }
      
      // آپلود تصویر جدید
      const imageUrl = await uploadBrandImageToStorage(brandId);
      if (imageUrl) {
        // بروزرسانی برند در دیتابیس
        const { error: updateError } = await supabase
          .from('brands')
          .update({ image: imageUrl })
          .eq('id', brandId);
        
        if (updateError) {
          throw updateError;
        }
        
        // بروزرسانی state محلی
        setDefaultBrands(prev => prev.map(b => 
          b.id === brandId ? { ...b, image: imageUrl } : b
        ));
        
        console.log(`تصویر برند ${brandId} در دیتابیس بروزرسانی شد:`, imageUrl);
        alert('تصویر برند بروزرسانی شد و در همه جا اعمال خواهد شد');
        setShowBrandImageModal(false);
        
        // اطمینان از بروزرسانی real-time
        setTimeout(() => {
          fetchBrands();
        }, 1000);
      }
    } catch (error) {
      console.error('Error updating brand image:', error);
      alert('خطا در بروزرسانی تصویر برند: ' + error.message);
    } finally {
      setUploadingBrandImage(false);
    }
  };

  const handleEditBrand = (brand, index) => { 
    setEditingBrand({ brand, index }); 
    setNewBrand({ name: brand.name || brand, description: brand.description || '', image: brand.image || '' }); 
    setBrandImagePreview(brand.image || null);
    setEditingBrandImage(null);
  };
  const handleUpdateBrand = async () => {
    try {
      if (!editingBrand) return; 
      if (!newBrand.name.trim()) return alert('نام برند الزامی است');
      setAddingBrand(true);
      
      // بررسی اینکه نام جدید با نام برندهای دیگر تداخل نداشته باشد
      const oldName = editingBrand.brand.name || editingBrand.brand;
      const newName = newBrand.name.trim();
      
      if (oldName !== newName) {
        // بررسی وجود برند با نام جدید
        const { data: existingBrand, error: checkError } = await supabase
          .from('brands')
          .select('id, name')
          .eq('name', newName)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }
        
        if (existingBrand) {
          alert(`برند "${newName}" قبلاً در سیستم وجود دارد. لطفاً نام دیگری انتخاب کنید.`);
          return;
        }
      }
      
      // ابتدا نام و توضیحات را بروزرسانی کن
      const { error } = await supabase.from('brands').update({ 
        name: newName, 
        description: newBrand.description || `برند ${newName}`
      }).eq('name', oldName);
      
      if (error) throw error;
      
      // اگر عکس جدید انتخاب شده، آن را آپلود کن
      if (selectedBrandImage) {
        // ابتدا عکس قدیمی را حذف کن
        const oldBrand = defaultBrands.find((_, i) => i === editingBrand.index);
        if (oldBrand && oldBrand.image) {
          try { await deleteBrandImage(oldBrand.image); } catch {}
        }
        
        // عکس جدید را آپلود کن - از ID برند استفاده کن
        const brandId = editingBrand.brand.id || editingBrand.brand;
        const imageUrl = await uploadBrandImageToStorage(brandId);
        if (imageUrl) {
          // برند را با عکس جدید بروزرسانی کن
          const { error: updateError } = await supabase
            .from('brands')
            .update({ image: imageUrl })
            .eq('id', brandId);
          
          if (updateError) {
            throw updateError;
          }
          
          console.log(`تصویر برند ${brandId} در ویرایش بروزرسانی شد:`, imageUrl);
        }
      }
      
      // بروزرسانی state محلی
      const copy = [...defaultBrands]; 
      copy[editingBrand.index] = { 
        ...copy[editingBrand.index], 
        name: newBrand.name.trim(),
        description: newBrand.description || `برند ${newBrand.name.trim()}`
      }; 
      setDefaultBrands(copy);
      
      setEditingBrand(null); 
      setNewBrand({ name:'', description:'', image: '' }); 
      clearBrandImageSelection();
      alert('برند بروزرسانی شد');
    } catch (e) { alert('خطا در بروزرسانی برند: ' + (e?.message||'')); }
    finally { setAddingBrand(false); }
  };
  const handleDeleteBrand = async (brand, index) => {
    try {
      setDeletingBrand(true);
      
      // ابتدا عکس برند را حذف کن
      const brandData = await supabase.from('brands').select('image').eq('name', brand.name || brand).single();
      if (brandData.data && brandData.data.image) {
        try { await deleteBrandImage(brandData.data.image); } catch {}
      }
      
      const { error } = await supabase.from('brands').delete().eq('name', brand.name || brand);
      if (error) throw error;
      setDefaultBrands(defaultBrands.filter((_, i)=> i!==index));
      alert('برند حذف شد');
    } catch (e) { alert('خطا در حذف برند: ' + (e?.message||'')); }
    finally { setDeletingBrand(false); }
  };

  // تابع برای نمایش لیست برندهای موجود
  const toggleExistingBrands = () => {
    setShowExistingBrands(!showExistingBrands);
  };

  // --- Category CRUD ---
  const handleAddCategory = async () => {
    try {
      if (!newCategory.name.trim()) return alert('نام دسته‌بندی الزامی است');
      setAddingCategory(true);
      const { error } = await supabase.from('categories').insert([{ name: newCategory.name.trim(), description: newCategory.description || `دسته‌بندی ${newCategory.name.trim()}`}]);
      if (error) throw error;
      setDefaultCategories([...defaultCategories, newCategory.name.trim()]);
      setNewCategory({ name: '', description: '' });
      alert('دسته‌بندی اضافه شد');
    } catch (e) { alert('خطا در افزودن دسته‌بندی: ' + (e?.message||'')); }
    finally { setAddingCategory(false); }
  };
  const handleEditCategory = (category, index) => { setEditingCategory({ category, index }); setNewCategory({ name: category, description: '' }); };
  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory) return; if (!newCategory.name.trim()) return alert('نام دسته‌بندی الزامی است');
      setAddingCategory(true);
      const { error } = await supabase.from('categories').update({ name: newCategory.name.trim(), description: newCategory.description || `دسته‌بندی ${newCategory.name.trim()}`}).eq('name', editingCategory.category);
      if (error) throw error;
      const copy = [...defaultCategories]; copy[editingCategory.index] = newCategory.name.trim(); setDefaultCategories(copy);
      setEditingCategory(null); setNewCategory({ name:'', description:'' }); alert('دسته‌بندی بروزرسانی شد');
    } catch (e) { alert('خطا در بروزرسانی دسته‌بندی: ' + (e?.message||'')); }
    finally { setAddingCategory(false); }
  };
  const handleDeleteCategory = async (category, index) => {
    try {
      setDeletingCategory(true);
      const { error } = await supabase.from('categories').delete().eq('name', category);
      if (error) throw error;
      setDefaultCategories(defaultCategories.filter((_, i)=> i!==index));
      alert('دسته‌بندی حذف شد');
    } catch (e) { alert('خطا در حذف دسته‌بندی: ' + (e?.message||'')); }
    finally { setDeletingCategory(false); }
  };

  // --- Pad Brand CRUD ---
  const handleAddPadBrand = async () => {
    try {
      if (!newPadBrand.name.trim()) return alert('نام برند لنت الزامی است');
      setAddingPadBrand(true);
      const { error } = await supabase.from('pad_brands').insert([{ name: newPadBrand.name.trim(), description: newPadBrand.description || `برند لنت ${newPadBrand.name.trim()}`}]);
      if (error) throw error;
      setDefaultPadBrands([...defaultPadBrands, newPadBrand.name.trim()]);
      setNewPadBrand({ name: '', description: '' });
      alert('برند لنت اضافه شد');
    } catch (e) { alert('خطا در افزودن برند لنت: ' + (e?.message||'')); }
    finally { setAddingPadBrand(false); }
  };
  const handleEditPadBrand = (padBrand, index) => { setEditingPadBrand({ name: padBrand, index }); setNewPadBrand({ name: padBrand, description: '' }); };
  const handleUpdatePadBrand = async () => {
    try {
      if (!editingPadBrand) return; if (!newPadBrand.name.trim()) return alert('نام برند لنت الزامی است');
      setAddingPadBrand(true);
      const { error } = await supabase.from('pad_brands').update({ name: newPadBrand.name.trim(), description: newPadBrand.description || `برند لنت ${newPadBrand.name.trim()}`}).eq('name', editingPadBrand.name);
      if (error) throw error;
      const copy = [...defaultPadBrands]; copy[editingPadBrand.index] = newPadBrand.name.trim(); setDefaultPadBrands(copy);
      setEditingPadBrand(null); setNewPadBrand({ name:'', description:'' }); alert('برند لنت بروزرسانی شد');
    } catch (e) { alert('خطا در بروزرسانی برند لنت: ' + (e?.message||'')); }
    finally { setAddingPadBrand(false); }
  };
  const handleDeletePadBrand = async (padBrand, index) => {
    try {
      setDeletingPadBrand(true);
      const { error } = await supabase.from('pad_brands').delete().eq('name', padBrand);
      if (error) throw error;
      setDefaultPadBrands(defaultPadBrands.filter((_, i)=> i!==index));
      alert('برند لنت حذف شد');
    } catch (e) { alert('خطا در حذف برند لنت: ' + (e?.message||'')); }
    finally { setDeletingPadBrand(false); }
  };

  // --- Brand Image Management ---



  // State برای آپلود عکس
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  // مدیریت چند عکس
  const [selectedFiles, setSelectedFiles] = useState([]); // File[]
  const [filePreviews, setFilePreviews] = useState([]);   // string[] dataURL
  const [mainImageIndex, setMainImageIndex] = useState(0); // کدام عکس اصلی باشد

  // برندها و دسته‌بندی‌ها - حالا از دیتابیس
  const [defaultBrands, setDefaultBrands] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [defaultPadBrands, setDefaultPadBrands] = useState([]);
  
  // گزینه‌های نوع خودرو - پیش‌فرض
  const vehicleTypeOptions = ['سواری', 'شاسی بلند', 'وانت', 'کامیون', 'اتوبوس'];
  
  // State برای فرم محصول
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    brand: '',
    padBrand: '',
    category: '',
    vehicleType: '',
    suitableFor: '',
    stockStatus: 'موجود',
    stockCount: '',
    description: '',
    material: '',
    thickness: '',
    weight: '',
    temperature: '',
    warranty: '',
    features: [''],
    reviewUser: '',
    reviewRating: 5,
    reviewComment: '',
    reviewDate: '',
    image: '',
    badges: { discount: false, bestseller: false, new: false }
  });
  
  // تابع برای reset کردن فرم محصول
  const resetProductForm = () => {
    setNewProduct({
      name: '',
      price: '',
      originalPrice: '',
      brand: '',
      padBrand: '',
      category: '',
      vehicleType: '',
      suitableFor: '',
      stockStatus: 'موجود',
      stockCount: '',
      description: '',
      material: '',
      thickness: '',
      weight: '',
      temperature: '',
      warranty: '',
      features: [''],
      reviewUser: '',
      reviewRating: 5,
      reviewComment: '',
      reviewDate: '',
      image: '',
      badges: { discount: false, bestseller: false, new: false }
    });
    
    // ریست کردن عکس‌ها
    clearAllImageSelections();
    
    console.log('Product form reset completed');
  };
  
  // تابع برای بررسی وجود ستون padBrand در جدول products
  const checkPadBrandColumn = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('padBrand')
        .limit(1);
      
      if (error) {
        console.log('padBrand column does not exist:', error.message);
        return false;
      }
      
      console.log('padBrand column exists');
      return true;
    } catch (e) {
      console.log('Error checking padBrand column:', e);
      return false;
    }
  };

  // بررسی احراز هویت
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/login');
      return;
    }
    fetchProducts();
    fetchBrands();
    fetchCategories();
    fetchPadBrands();
    
    // بررسی وجود ستون padBrand
    checkPadBrandColumn();
    
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Real-time change:', payload);
          fetchProducts();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'brands' }, 
        (payload) => {
          console.log('Real-time brands change:', payload);
          fetchBrands();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' }, 
        (payload) => {
          console.log('Real-time categories change:', payload);
          fetchCategories();
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pad_brands' }, 
        (payload) => {
          console.log('Real-time pad_brands change:', payload);
          fetchPadBrands();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } else {
      setProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*");

      if (error) {
        console.error("Error fetching brands:", error);
        await initializeDefaultBrands();
      } else {
        // برندها را با عکس‌هایشان ذخیره کن
        setDefaultBrands(data || []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      await initializeDefaultBrands();
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (error) {
        console.error("Error fetching categories:", error);
        await initializeDefaultCategories();
      } else {
        setDefaultCategories(data.map(category => category.name) || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      await initializeDefaultCategories();
    }
  };

  const fetchPadBrands = async () => {
    try {
      const { data, error } = await supabase
        .from('pad_brands')
        .select('*');

      if (error) {
        console.error('Error fetching pad brands:', error);
        await initializeDefaultPadBrands();
      } else {
        setDefaultPadBrands(data.map(pb => pb.name) || []);
      }
    } catch (error) {
      console.error('Error fetching pad brands:', error);
      await initializeDefaultPadBrands();
    }
  };

  const initializeDefaultBrands = async () => {
    const defaultBrandsList = [
      { name: "تویوتا", description: "برند تویوتا", image: "/toyota.png" },
      { name: "هیوندای", description: "برند هیوندای", image: "/hyun.png" },
      { name: "نیسان", description: "برند نیسان", image: "/nissan.png" },
      { name: "کیا", description: "برند کیا", image: "/kia.png" },
      { name: "لکسوس", description: "برند لکسوس", image: "/lexus.png" },
      { name: "جیلی", description: "برند جیلی", image: "/geely.png" },
      { name: "مزدا", description: "برند مزدا", image: "/mazda.png" },
      { name: "ام‌جی", description: "برند ام‌جی", image: "/mg.png" },
      { name: "میتسوبیشی", description: "برند میتسوبیشی", image: "/mitsubishi.png" },
      { name: "فولکس‌واگن", description: "برند فولکس‌واگن", image: "/volkswagen.png" },
      { name: "سایپا", description: "برند سایپا", image: "/saipa.png" },
      { name: "سوزوکی", description: "برند سوزوکی", image: "/suzuki.png" },
      { name: "رنو", description: "برند رنو", image: "/renault.png" },
      { name: "پژو", description: "برند پژو", image: "/peugeot.png" },
      { name: "ایران خودرو", description: "برند ایران خودرو", image: "/irankhodro.png" },
      { name: "فاو", description: "برند فاو", image: "/faw.png" },
      { name: "جی‌ای‌سی", description: "برند جی‌ای‌سی", image: "/jac.png" }
    ];

    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*');

      if (error) {
        console.log("Brands table doesn't exist, using local state");
        setDefaultBrands(defaultBrandsList);
        return;
      }

      if (data && data.length > 0) {
        setDefaultBrands(data);
      } else {
        const { error: insertError } = await supabase
          .from("brands")
          .insert(defaultBrandsList);

        if (!insertError) {
          setDefaultBrands(defaultBrandsList);
        } else {
          console.error("Error inserting default brands:", insertError);
          setDefaultBrands(defaultBrandsList);
        }
      }
    } catch (error) {
      console.error("Error initializing brands:", error);
      setDefaultBrands(defaultBrandsList);
    }
  };

  const initializeDefaultPadBrands = async () => {
    const defaultPadBrandsList = [
      'آفورتیس', 'آسیمکو', 'امکو'
    ];

    try {
      const { data, error } = await supabase
        .from('pad_brands')
        .select('*');

      if (error) {
        console.log("Pad brands table doesn't exist, using local state");
        setDefaultPadBrands(defaultPadBrandsList);
        return;
      }

      if (data && data.length > 0) {
        setDefaultPadBrands(data.map(pb => pb.name));
      } else {
        const padBrandsData = defaultPadBrandsList.map(name => ({
          name,
          description: `برند لنت ${name}`
        }));

        const { error: insertError } = await supabase
          .from('pad_brands')
          .insert(padBrandsData);

        if (!insertError) {
          setDefaultPadBrands(defaultPadBrandsList);
        } else {
          console.error('Error inserting default pad brands:', insertError);
          setDefaultPadBrands(defaultPadBrandsList);
        }
      }
    } catch (error) {
      console.error('Error initializing pad brands:', error);
      setDefaultPadBrands(defaultPadBrandsList);
    }
  };

    // راه‌اندازی دسته‌بندی‌های پیش‌فرض
  const initializeDefaultCategories = async () => {
    const defaultCategoriesList = [
      "دیسکی", "کمپوزیتی", "سرامیکی", "فلزی", "پلاستیکی"
    ];

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.log("Categories table doesn't exist, using local state");
        setDefaultCategories(defaultCategoriesList);
          return;
        }

      if (data && data.length > 0) {
        setDefaultCategories(data.map(category => category.name));
      } else {
        const categoriesData = defaultCategoriesList.map(name => ({
          name,
          description: `دسته‌بندی ${name}`
        }));

        const { error: insertError } = await supabase
          .from("categories")
          .insert(categoriesData);

        if (!insertError) {
          setDefaultCategories(defaultCategoriesList);
        } else {
          console.error("Error inserting default categories:", insertError);
          setDefaultCategories(defaultCategoriesList);
        }
      }
    } catch (error) {
      console.error("Error initializing categories:", error);
      setDefaultCategories(defaultCategoriesList);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('لطفاً فقط فایل تصویری انتخاب کنید. فرمت‌های مجاز: JPG, PNG, GIF, WebP');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }

      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      console.log('Main image selected:', file.name, 'Size:', file.size, 'Type:', file.type);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setNewProduct({...newProduct, image: ""});
    setSelectedFiles([]);
    setFilePreviews([]);
    setMainImageIndex(0);
  };

  // تابع جدید برای پاک کردن کامل انتخاب عکس‌ها
  const clearAllImageSelections = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setSelectedFiles([]);
    setFilePreviews([]);
    setMainImageIndex(0);
    
    console.log('All image selections cleared');
  };

  // تابع برای پاک کردن عکس‌های انتخاب شده جدید
  const clearNewImageSelections = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    setMainImageIndex(0);
    
    console.log('New image selections cleared');
    
    // عکس‌های گالری فعلی رو حفظ می‌کنیم
    if (editingProduct && editingProduct.gallery_images) {
      console.log('Current gallery images preserved:', editingProduct.gallery_images.length);
    }
  };

  // تابع برای نمایش وضعیت عکس‌های محصول
  const getImageStatusMessage = (product) => {
    if (!product) return '';
    
    let message = '';
    if (product.image) {
      message += `عکس اصلی: موجود\n`;
    } else {
      message += `عکس اصلی: موجود نیست\n`;
    }
    
    if (product.gallery_images && product.gallery_images.length > 0) {
      message += `عکس‌های گالری: ${product.gallery_images.length} عدد`;
    } else {
      message += `عکس‌های گالری: موجود نیست`;
    }
    
    return message;
  };

  const uploadImageToStorage = async (productId) => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      
      // ایجاد نام فایل منحصر به فرد با timestamp
      const uniqueId = `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const imageUrl = await uploadProductImage(selectedImage, uniqueId);
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود عکس: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // تابع جدید برای آپلود عکس‌های گالری
  const uploadGalleryImageToStorage = async (file, productId) => {
    if (!file) return null;
    
    try {
      setUploadingImage(true);
      
      // ایجاد نام فایل منحصر به فرد با timestamp
      const uniqueId = `${productId}-gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const imageUrl = await uploadProductImage(file, uniqueId);
      
      return imageUrl;
    } catch (error) {
      console.error('Error uploading gallery image:', error);
      alert('خطا در آپلود عکس گالری: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // انتخاب چند عکس و پیش نمایش
  const handleImageFilesChange = (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4); // حداکثر 4 عکس گالری
    if (files.length === 0) {
      setSelectedFiles([]);
      setFilePreviews([]);
      setMainImageIndex(0);
      return;
    }
    
    // اعتبارسنجی ساده
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = files.filter(f => allowedTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
    
    if (validFiles.length === 0) {
      alert('هیچ فایل تصویری معتبری انتخاب نشده است. فرمت‌های مجاز: JPG, PNG, GIF, WebP و حداکثر حجم 5MB');
      return;
    }
    
    // پاک کردن عکس‌های قبلی و تنظیم عکس‌های جدید
    setSelectedFiles(validFiles);
    setMainImageIndex(0);
    
    // ساخت previews
    const readers = validFiles.map(f => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(f);
    }));
    
    Promise.all(readers).then((urls) => {
      setFilePreviews(urls);
      console.log('Gallery images selected:', validFiles.length, 'files');
      
      // نمایش اطلاعات عکس‌های انتخاب شده
      validFiles.forEach((file, index) => {
        console.log(`Gallery image ${index + 1}:`, file.name, 'Size:', file.size, 'Type:', file.type);
      });
    });
  };

  const handleLogout = async () => {
    try {
      await supabase?.auth?.signOut?.();
    } catch {}
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  // افزودن محصول جدید
  const handleAddProduct = async () => {
    try {
      setAddingProduct(true);
      // ابتدا تصویر اصلی را در صورت وجود آپلود کن
      // آپلود عکس‌ها: عکس اصلی + عکس‌های گالری
      let imageUrl = "";
      let galleryImages = [];
      
      // آپلود عکس اصلی
      if (selectedImage) {
        const tmpId = Date.now();
        const uploaded = await uploadImageToStorage(tmpId);
        if (!uploaded) {
          alert('خطا در آپلود عکس اصلی.');
          return;
        }
        imageUrl = uploaded;
        console.log('Main image uploaded successfully:', uploaded);
      }
      
      // آپلود عکس‌های گالری
      if (selectedFiles.length > 0) {
        const tmpId = Date.now();
        for (const f of selectedFiles) {
          const up = await uploadGalleryImageToStorage(f, tmpId + Math.random());
          if (up) {
            galleryImages.push(up);
            console.log('Gallery image uploaded successfully:', up);
          }
        }
        console.log('Total gallery images uploaded:', galleryImages.length);
      }
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice || newProduct.price,
        brand: newProduct.brand,
        category: newProduct.category,
        vehicleType: newProduct.vehicleType,
        suitableFor: newProduct.suitableFor,
        stockStatus: newProduct.stockStatus,
        stockCount: parseInt(newProduct.stockCount) || 0,
        description: newProduct.description,
        image: imageUrl,
        specifications: {
          material: newProduct.material,
          thickness: newProduct.thickness,
          weight: newProduct.weight,
          temperature: newProduct.temperature,
          warranty: newProduct.warranty
        },
        features: newProduct.features.filter(f => f.trim() !== ''),
        reviews: [{
          id: Date.now(),
          user: newProduct.reviewUser,
          rating: parseInt(newProduct.reviewRating),
          comment: newProduct.reviewComment,
          date: newProduct.reviewDate || new Date().toLocaleDateString('fa-IR')
        }],
        created_at: new Date().toISOString()
      };
      
      // اضافه کردن فیلد padBrand
      if (newProduct.padBrand) {
        productData.padbrand = newProduct.padBrand;
      }
      
      // تلاش برای درج با badges و gallery_images
      let insertData = { ...productData, badges: newProduct.badges, gallery_images: galleryImages };
      let { error } = await supabase.from('products').insert([insertData]);
      
      // اگر خطای badges داشت، بدون badges درج کن
      if (error && /badges/i.test(error.message)) {
        console.log('Badges column not found, inserting without badges...');
        const { badges, ...fallbackData } = insertData;
        const { error: retryErr } = await supabase.from('products').insert([fallbackData]);
        if (retryErr) {
          // اگر gallery_images هم مشکل داشت
          if (/gallery_images/i.test(retryErr.message)) {
            const { gallery_images, ...finalData } = fallbackData;
            const { error: finalErr } = await supabase.from('products').insert([finalData]);
            if (finalErr) throw finalErr;
          } else {
            throw retryErr;
          }
        }
      } else if (error) {
        // اگر خطای gallery_images داشت
        if (/gallery_images/i.test(error.message)) {
          const { gallery_images, ...fallbackData } = insertData;
          const { error: retryErr } = await supabase.from('products').insert([fallbackData]);
          if (retryErr) throw retryErr;
        } else {
          throw error;
        }
      }
      // فرم باز بماند و مقدارها ریست شوند تا کاربر بتواند ادامه دهد
      setNewProduct({
        name: "",
        price: "",
        originalPrice: "",
        brand: "",
        padBrand: "",
        category: "",
        vehicleType: "",
        suitableFor: "",
        stockStatus: "موجود",
        stockCount: "",
        description: "",
        material: "",
        thickness: "",
        weight: "",
        temperature: "",
        warranty: "",
        features: [""],
        reviewUser: "",
        reviewRating: 5,
        reviewComment: "",
        reviewDate: "",
        image: "",
        badges: {
          discount: false,
          bestseller: false,
          new: false
        }
      });
      clearAllImageSelections();
      setEditingProduct(null);
      setShowAddForm(true);
      await fetchProducts();
      
      // نمایش پیام موفقیت با جزئیات عکس‌ها
      let successMessage = 'محصول با موفقیت اضافه شد!';
      if (imageUrl) {
        successMessage += '\n\nعکس اصلی آپلود شد.';
      }
      if (galleryImages.length > 0) {
        successMessage += `\n${galleryImages.length} عکس گالری آپلود شد.`;
      }
      
      alert(successMessage);
    } catch (e) {
      console.error('Error adding product:', e);
      alert('خطا در افزودن محصول: ' + (e?.message || ''));
    } finally {
      setAddingProduct(false);
    }
  };

  // ویرایش محصول
  const handleEditProduct = (product) => {
    console.log('Editing product:', product);
    setEditingProduct(product);
    
    // پر کردن فرم با اطلاعات محصول
    const formData = {
      name: product.name || '',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      brand: product.brand || '',
      padBrand: product.padbrand || product.padBrand || '',
      category: product.category || '',
      vehicleType: product.vehicleType || '',
      suitableFor: product.suitableFor || '',
      stockStatus: product.stockStatus || 'موجود',
      stockCount: product.stockCount || '',
      description: product.description || '',
      material: product.specifications?.material || '',
      thickness: product.specifications?.thickness || '',
      weight: product.specifications?.weight || '',
      temperature: product.specifications?.temperature || '',
      warranty: product.specifications?.warranty || '',
      features: product.features && product.features.length > 0 ? product.features : [''],
      reviewUser: product.reviews && product.reviews.length > 0 ? product.reviews[0].user : '',
      reviewRating: product.reviews && product.reviews.length > 0 ? product.reviews[0].rating : 5,
      reviewComment: product.reviews && product.reviews.length > 0 ? product.reviews[0].comment : '',
      reviewDate: product.reviews && product.reviews.length > 0 ? product.reviews[0].date : '',
      image: product.image || '',
      badges: product.badges || { discount: false, bestseller: false, new: false }
    };
    
    console.log('Form data to be set:', formData);
    setNewProduct(formData);
    
    // نمایش عکس اصلی فعلی
    setImagePreview(product.image || null);
    
    // ریست کردن عکس‌های انتخاب شده جدید
    setSelectedFiles([]);
    setFilePreviews([]);
    setMainImageIndex(0);
    
    // نمایش عکس‌های گالری فعلی (اگر وجود داشته باشند)
    if (product.gallery_images && product.gallery_images.length > 0) {
      console.log('Current gallery images:', product.gallery_images);
      console.log('Gallery images count:', product.gallery_images.length);
      
      // عکس‌های گالری فعلی رو در state جداگانه نگه می‌داریم
      // تا با عکس‌های جدید انتخاب شده تداخل نداشته باشند
      console.log('Current gallery images preserved for display');
    }
    
    // نمایش وضعیت عکس‌های محصول
    console.log('Product image status:', getImageStatusMessage(product));
    
    setShowAddForm(true);
  };

  // بروزرسانی محصول
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      setAddingProduct(true);
      
      // مدیریت تصاویر - ابتدا عکس‌های قدیمی را حذف کن
      let imageUrl = editingProduct.image;
      let galleryImages = editingProduct.gallery_images || [];
      
      // اگر عکس اصلی جدید انتخاب شده
      if (selectedImage) {
        console.log('Updating main image');
        
        // تأیید از کاربر برای حذف عکس اصلی قدیمی
        if (editingProduct.image) {
          const confirmMessage = `آیا مطمئن هستید که می‌خواهید عکس اصلی محصول "${editingProduct.name}" را با عکس جدید جایگزین کنید؟\n\nوضعیت فعلی:\n${getImageStatusMessage(editingProduct)}\n\nاین عمل قابل بازگشت نیست.`;
          if (!window.confirm(confirmMessage)) {
            setAddingProduct(false);
            return;
          }
        }
        
        // حذف عکس اصلی قدیمی
        if (editingProduct.image) {
          try { 
            await deleteProductImage(editingProduct.image); 
            console.log('Deleted old main image');
          } catch (error) {
            console.warn('Could not delete old main image:', error);
            alert(`عکس اصلی قدیمی حذف نشد: ${editingProduct.image}\n\nلطفاً بعداً به صورت دستی حذف کنید یا با پشتیبانی تماس بگیرید.`);
          }
        }
        
        // آپلود عکس اصلی جدید
        const newUrl = await uploadImageToStorage(editingProduct.id);
        if (newUrl) {
          imageUrl = newUrl;
          console.log('Uploaded new main image:', newUrl);
        } else {
          console.warn('Failed to upload new main image, keeping existing image');
          imageUrl = editingProduct.image || '';
          alert('خطا در آپلود عکس اصلی جدید. عکس قبلی حفظ شد.');
          throw new Error('خطا در آپلود عکس اصلی جدید. عکس قبلی حفظ شد.');
        }
      }
      
      // اگر عکس‌های گالری جدید انتخاب شده‌اند
      if (selectedFiles.length > 0) {
        console.log('Updating gallery images:', selectedFiles.length, 'files');
        
        // تأیید از کاربر برای حذف عکس‌های گالری قدیمی
        if (editingProduct.gallery_images && editingProduct.gallery_images.length > 0) {
          const confirmMessage = `آیا مطمئن هستید که می‌خواهید عکس‌های گالری قبلی محصول "${editingProduct.name}" را با عکس‌های جدید جایگزین کنید؟\n\nعکس‌های گالری فعلی: ${editingProduct.gallery_images.length} عدد\n\nاین عمل قابل بازگشت نیست.`;
          if (!window.confirm(confirmMessage)) {
            setAddingProduct(false);
            return;
          }
        }
        
        // حذف عکس‌های گالری قدیمی
        if (editingProduct.gallery_images && editingProduct.gallery_images.length > 0) {
          for (const oldGalleryImage of editingProduct.gallery_images) {
            try {
              await deleteProductImage(oldGalleryImage);
              console.log('Deleted old gallery image:', oldGalleryImage);
            } catch (error) {
              console.warn('Could not delete old gallery image:', error);
              alert(`عکس گالری قدیمی حذف نشد: ${oldGalleryImage}\n\nلطفاً بعداً به صورت دستی حذف کنید یا با پشتیبانی تماس بگیرید.`);
            }
          }
        }
        
        // آپلود عکس‌های گالری جدید
        const newGallery = [];
        for (const f of selectedFiles) {
          const up = await uploadGalleryImageToStorage(f, editingProduct.id);
          if (up) {
            newGallery.push(up);
            console.log('Uploaded new gallery image:', up);
          } else {
            console.warn('Failed to upload gallery image:', f.name);
          }
        }
        
        if (newGallery.length > 0) {
          galleryImages = newGallery;
          console.log('Gallery images updated successfully:', newGallery.length, 'images');
          
          // نمایش جزئیات عکس‌های آپلود شده
          newGallery.forEach((url, index) => {
            console.log(`Gallery image ${index + 1} uploaded:`, url);
          });
        } else {
          console.warn('No gallery images uploaded, keeping existing ones');
          galleryImages = editingProduct.gallery_images || [];
          console.log('Keeping existing gallery images:', editingProduct.gallery_images);
        }
      }
      
      // اگر هیچ عکس جدیدی انتخاب نشده، عکس‌های قبلی را حفظ کن
      if (!selectedFiles.length && !selectedImage) {
        console.log('No new images selected, keeping existing images');
        imageUrl = editingProduct.image || '';
        galleryImages = editingProduct.gallery_images || [];
        console.log('Image status unchanged:', getImageStatusMessage(editingProduct));
      }
      
      // ساخت productData با مدیریت خطاهای ستون‌های اختیاری
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice || newProduct.price,
        brand: newProduct.brand,
        category: newProduct.category,
        vehicleType: newProduct.vehicleType,
        suitableFor: newProduct.suitableFor,
        stockStatus: newProduct.stockStatus,
        stockCount: parseInt(newProduct.stockCount) || 0,
        description: newProduct.description,
        image: imageUrl,
        specifications: {
          material: newProduct.material,
          thickness: newProduct.thickness,
          weight: newProduct.weight,
          temperature: newProduct.temperature,
          warranty: newProduct.warranty
        },
        features: newProduct.features.filter(f => f.trim() !== ''),
        reviews: [{
          id: Date.now(),
          user: newProduct.reviewUser,
          rating: parseInt(newProduct.reviewRating),
          comment: newProduct.reviewComment,
          date: newProduct.reviewDate || new Date().toLocaleDateString('fa-IR')
        }],
        updated_at: new Date().toISOString()
      };
      
      // اضافه کردن فیلد padBrand
      if (newProduct.padBrand) {
        productData.padbrand = newProduct.padBrand;
      }
      
      // تلاش برای بروزرسانی با badges و gallery_images
      let updateData = { ...productData, badges: newProduct.badges, gallery_images: galleryImages };
      let { error } = await supabase.from('products').update(updateData).eq('id', editingProduct.id);
      
      // اگر خطای badges داشت، بدون badges بروزرسانی کن
      if (error && /badges/i.test(error.message)) {
        console.log('Badges column not found, updating without badges...');
        const { badges, ...fallbackUpdate } = updateData;
        const { error: retryErr } = await supabase.from('products').update(fallbackUpdate).eq('id', editingProduct.id);
        if (retryErr) {
          // اگر gallery_images هم مشکل داشت
          if (/gallery_images/i.test(retryErr.message)) {
            const { gallery_images, ...finalUpdate } = fallbackUpdate;
            const { error: finalErr } = await supabase.from('products').update(finalUpdate).eq('id', editingProduct.id);
            if (finalErr) throw finalErr;
          } else {
            throw retryErr;
          }
        }
      } else if (error) {
        // اگر خطای gallery_images داشت
        if (/gallery_images/i.test(error.message)) {
          const { gallery_images, ...fallbackUpdate } = updateData;
          const { error: retryErr } = await supabase.from('products').update(fallbackUpdate).eq('id', editingProduct.id);
          if (retryErr) throw retryErr;
        } else {
          throw error;
        }
      }
      
      setShowAddForm(false);
      setEditingProduct(null);
      clearAllImageSelections();
      
      // پاک کردن عکس‌های انتخاب شده جدید
      setSelectedFiles([]);
      setFilePreviews([]);
      
      await fetchProducts();
      
      // نمایش پیام موفقیت
      let successMessage = `محصول "${productData.name}" با موفقیت بروزرسانی شد!`;
      
      if (selectedImage) {
        successMessage += '\n\nعکس اصلی جدید آپلود شد.';
        if (editingProduct.image) {
          successMessage += '\nعکس اصلی قبلی حذف شد.';
        }
      }
      
      if (selectedFiles.length > 0) {
        successMessage += `\n\n${selectedFiles.length} عکس گالری جدید آپلود شد.`;
        if (editingProduct.gallery_images && editingProduct.gallery_images.length > 0) {
          successMessage += '\nعکس‌های گالری قبلی حذف شدند.';
        }
      }
      
      if (!selectedImage && !selectedFiles.length) {
        successMessage += '\n\nعکس‌های قبلی حفظ شدند.';
      }
      
      // نمایش وضعیت نهایی عکس‌ها
      successMessage += `\n\nوضعیت نهایی عکس‌ها:\nعکس اصلی: ${imageUrl ? 'موجود' : 'موجود نیست'}\nعکس‌های گالری: ${galleryImages.length} عدد`;
      
      console.log('Final image status:', { mainImage: imageUrl, galleryImages });
      console.log(successMessage);
      alert(successMessage);
    } catch (e) {
      console.error('Error updating product:', e);
      alert('خطا در بروزرسانی محصول: ' + (e?.message || ''));
    } finally {
      setAddingProduct(false);
    }
  };

  // حذف محصول
  const handleDeleteProduct = async (productId) => {
      try {
      setDeletingProduct(true);
      const target = products.find(p => p.id === productId);
      if (target?.image) {
        try { await deleteProductImage(target.image); } catch {}
      }
      const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) throw error;
      await fetchProducts();
      alert('محصول با موفقیت حذف شد!');
    } catch (e) {
      console.error('Error deleting product:', e);
      alert('خطا در حذف محصول: ' + (e?.message || ''));
    } finally {
      setDeletingProduct(false);
      setShowDeleteConfirm(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // بهبود فیلتر برند - پشتیبانی از نام‌های مختلف
    let matchesBrand = true;
    if (selectedBrand && selectedBrand !== '') {
      const productBrand = product.brand?.trim() || '';
      const selectedBrandTrimmed = selectedBrand.trim();
      
      // مقایسه دقیق
      if (productBrand === selectedBrandTrimmed) {
        matchesBrand = true;
      } else {
        // مقایسه partial برای برندهایی که ممکن است نام‌های مختلف داشته باشند
        const brandVariants = {
          'ام‌جی': ['ام‌جی', 'ام جی', 'MG', 'mg'],
          'ام جی': ['ام‌جی', 'ام جی', 'MG', 'mg'],
          'بی‌ام‌دبلیو': ['بی‌ام‌دبلیو', 'BMW', 'bmw'],
          'BMW': ['بی‌ام‌دبلیو', 'BMW', 'bmw'],
          'فولکس‌واگن': ['فولکس‌واگن', 'فولکس واگن', 'Volkswagen', 'volkswagen'],
          'فولکس واگن': ['فولکس‌واگن', 'فولکس واگن', 'Volkswagen', 'volkswagen'],
          'ایران خودرو': ['ایران خودرو', 'ایران‌خودرو'],
          'ایران‌خودرو': ['ایران خودرو', 'ایران‌خودرو'],
          'جی‌ای‌سی': ['جی‌ای‌سی', 'جک', 'JAC', 'jac'],
          'جک': ['جی‌ای‌سی', 'جک', 'JAC', 'jac']
        };
        
        const variants = brandVariants[selectedBrandTrimmed] || [selectedBrandTrimmed];
        matchesBrand = variants.some(variant => 
          productBrand.toLowerCase().includes(variant.toLowerCase()) ||
          variant.toLowerCase().includes(productBrand.toLowerCase())
        );
      }
    }
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // دیباگ برای برند ام‌جی
    if (selectedBrand === 'ام‌جی' || selectedBrand === 'ام جی') {
      console.log('Filtering for MG brand:', {
        productBrand: product.brand,
        selectedBrand,
        matchesBrand,
        product: product.name
      });
    }
    
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const productBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const productCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const productVehicleTypes = [...new Set(products.map(p => p.vehicleType).filter(Boolean))];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">در حال بارگذاری...</div>
    </div>
  );

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen overflow-x-hidden">
        {/* Header */}
             <div className="bg-white shadow-sm border-b w-full">
         <div className="w-full px-3 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">پنل ادمین</h1>
              <p className="text-xs md:text-sm text-gray-600">مدیریت محصولات لنت شاپ</p>
        </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm md:text-base"
            >
              خروج
            </button>
              </div>
            </div>
          </div>

             <div className="w-full px-3 md:px-6 lg:px-8 py-6 overflow-x-hidden">
          {/* Tab Navigation */}
         <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 w-full">
           <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:space-x-1 sm:space-x-reverse w-full">
             <button
               onClick={() => setActiveTab('products')}
               className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex-1 sm:flex-none ${
                 activeTab === 'products'
                   ? 'bg-blue-600 text-white'
                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
               }`}
             >
               مدیریت محصولات
             </button>
            <button
              onClick={() => setActiveTab('brands')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex-1 sm:flex-none ${
                activeTab === 'brands'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              مدیریت برندها، برندهای لنت و دسته‌بندی‌ها
            </button>
            <button
              onClick={() => setActiveTab('price-editor')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex-1 sm:flex-none ${
                activeTab === 'price-editor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ویرایش قیمت محصولات
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition-colors flex-1 sm:flex-none ${
                activeTab === 'backup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              بک‌آپ دیتابیس
            </button>
            </div>
          </div>

                  {/* Conditional Content Based on Active Tab */}
         {activeTab === 'products' ? (
           <>
            {/* Products Section Header */}
                         <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
               <h2 className="text-lg md:text-xl font-bold text-gray-800 text-right">مدیریت محصولات</h2>
               <p className="text-xs md:text-sm text-gray-600 mt-1 text-right">افزودن، ویرایش و مدیریت موجودی محصولات</p>
               <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                 <p className="text-xs text-blue-700 text-right">
                   💡 برای ویرایش محصول: روی دکمه "ویرایش" در کنار هر محصول کلیک کنید
                 </p>
               </div>
             </div>
             {/* Search and Filters */}
             <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 w-full">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 items-stretch w-full">
                 <div className="md:col-span-2 w-full">
                   <input
                     type="text"
                     placeholder="جستجو در محصولات..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm md:text-base"
                   />
                 </div>
                 <div className="w-full">
                   <select
                     value={selectedBrand}
                     onChange={(e) => setSelectedBrand(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm md:text-base"
                   >
                     <option value="">همه برندها</option>
                     {productBrands.map(brand => (
                       <option key={brand} value={brand}>{brand}</option>
                         ))}
                      </select>
                    </div>
                 <div className="w-full">
                   <select
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 md:px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right text-sm md:text-base"
                   >
                     <option value="">همه دسته‌ها</option>
                     {productCategories.map(category => (
                       <option key={category} value={category}>{category}</option>
                     ))}
                   </select>
                 </div>
                 <div className="flex items-end">
                   <button
                     onClick={() => {
                       console.log('=== دیباگ محصولات ===');
                       console.log('تعداد کل محصولات:', products.length);
                       console.log('برندهای موجود:', productBrands);
                       console.log('دسته‌های موجود:', productCategories);
                       console.log('محصولات ام‌جی:', products.filter(p => 
                         p.brand?.toLowerCase().includes('ام') || 
                         p.brand?.toLowerCase().includes('mg')
                       ));
                       console.log('فیلترهای فعال:', { selectedBrand, selectedCategory, searchTerm });
                       console.log('محصولات فیلتر شده:', filteredProducts);
                     }}
                     className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                   >
                     دیباگ
                   </button>
                 </div>
               </div>
               <div className="mt-4 flex justify-end">
                 <button
                   onClick={() => {
                     console.log('Adding product button clicked');
                     resetProductForm();
                     setEditingProduct(null);
                     clearAllImageSelections();
                     setShowAddForm(true);
                     console.log('showAddForm set to true');
                   }}
                   className="bg-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
                 >
                        + افزودن محصول
                 </button>
               </div>
             </div>
           {/* Add / Edit Product Form */}
           {showAddForm && (
             <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-base md:text-lg font-bold">{editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
                 <button
                   onClick={() => { 
                     setShowAddForm(false); 
                     setEditingProduct(null); 
                     clearAllImageSelections();
                     resetProductForm();
                   }}
                   className="text-gray-500 hover:text-gray-700 text-xl"
                 >
                   ×
                 </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="نام محصول" value={newProduct.name} onChange={(e)=>setNewProduct({...newProduct,name:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="قیمت (تومان)" value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct,price:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="قیمت اصلی (اختیاری)" value={newProduct.originalPrice} onChange={(e)=>setNewProduct({...newProduct,originalPrice:e.target.value})} />
                 {/* برند خودرو از تب برندها (دینامیک از DB) */}
                 <select className="border rounded-lg px-3 py-2 w-full" value={newProduct.brand} onChange={(e)=>setNewProduct({...newProduct,brand:e.target.value})}>
                   <option value="">انتخاب برند خودرو</option>
                   {defaultBrands.map((b)=> (
                     <option key={b.name} value={b.name}>{b.name}</option>
                   ))}
                 </select>
                 {/* دسته‌بندی نوع لنت از تب دسته‌بندی‌ها (دینامیک از DB) */}
                 <select className="border rounded-lg px-3 py-2 w-full" value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct,category:e.target.value})}>
                   <option value="">انتخاب دسته‌بندی</option>
                   {defaultCategories.map((c)=> (
                     <option key={c} value={c}>{c}</option>
                   ))}
                 </select>
                 {/* نوع خودرو (بر اساس داده‌های موجود) */}
                 <select className="border rounded-lg px-3 py-2 w-full" value={newProduct.vehicleType} onChange={(e)=>setNewProduct({...newProduct,vehicleType:e.target.value})}>
                   <option value="">نوع خودرو</option>
                   {vehicleTypeOptions.map((vt)=> (
                     <option key={vt} value={vt}>{vt}</option>
                   ))}
                 </select>
                 {/* برند لنت از تب برندهای لنت (دینامیک از DB) */}
                 <div className="md:col-span-2">
                   <select className="border rounded-lg px-3 py-2 w-full" value={newProduct.padBrand} onChange={(e)=>setNewProduct({...newProduct,padBrand:e.target.value})}>
                     <option value="">انتخاب برند لنت</option>
                     {defaultPadBrands.map((pb)=> (
                       <option key={pb} value={pb}>{pb}</option>
                     ))}
                   </select>
                   <p className="text-xs text-gray-500 mt-1 text-right">
                     ⚠️ توجه: فیلد برند لنت ممکن است در دیتابیس موجود نباشد
                   </p>
                 </div>
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="مناسب برای" value={newProduct.suitableFor} onChange={(e)=>setNewProduct({...newProduct,suitableFor:e.target.value})} />
                 <select className="border rounded-lg px-3 py-2 w-full" value={newProduct.stockStatus} onChange={(e)=>setNewProduct({...newProduct,stockStatus:e.target.value})}>
                   <option value="موجود">موجود</option>
                   <option value="اتمام موجودی">اتمام موجودی</option>
                 </select>
                 {newProduct.stockStatus === 'موجود' && (
                   <input className="border rounded-lg px-3 py-2 w-full" placeholder="تعداد موجودی" type="number" value={newProduct.stockCount} onChange={(e)=>setNewProduct({...newProduct,stockCount:e.target.value})} />
                 )}
                 <textarea className="border rounded-lg px-3 py-2 w-full md:col-span-2" placeholder="توضیحات" rows={3} value={newProduct.description} onChange={(e)=>setNewProduct({...newProduct,description:e.target.value})} />
                 {/* مشخصات فنی محصول */}
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="جنس لنت (material)" value={newProduct.material} onChange={(e)=>setNewProduct({...newProduct,material:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="ضخامت (thickness)" value={newProduct.thickness} onChange={(e)=>setNewProduct({...newProduct,thickness:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="وزن (weight)" value={newProduct.weight} onChange={(e)=>setNewProduct({...newProduct,weight:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="دمای مقاوم (temperature)" value={newProduct.temperature} onChange={(e)=>setNewProduct({...newProduct,temperature:e.target.value})} />
                 <input className="border rounded-lg px-3 py-2 w-full" placeholder="گارانتی (warranty)" value={newProduct.warranty} onChange={(e)=>setNewProduct({...newProduct,warranty:e.target.value})} />
                 
                 {/* Features Section */}
                 <div className="md:col-span-2">
                   <label className="block text-sm mb-2 text-right">ویژگی‌های محصول</label>
                   {newProduct.features.map((feature, index) => (
                     <div key={index} className="flex gap-2 mb-2">
                       <input
                         type="text"
                         placeholder={`ویژگی ${index + 1}`}
                         value={feature}
                         onChange={(e) => {
                           const newFeatures = [...newProduct.features];
                           newFeatures[index] = e.target.value;
                           setNewProduct({ ...newProduct, features: newFeatures });
                         }}
                         className="flex-1 border rounded-lg px-3 py-2"
                       />
                       <button
                         type="button"
                         onClick={() => {
                           const newFeatures = newProduct.features.filter((_, i) => i !== index);
                           setNewProduct({ ...newProduct, features: newFeatures });
                         }}
                         className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                       >
                         حذف
                       </button>
                     </div>
                   ))}
                   <button
                     type="button"
                     onClick={() => {
                       setNewProduct({
                         ...newProduct,
                         features: [...newProduct.features, '']
                       });
                     }}
                     className="w-full px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                   >
                     + افزودن ویژگی
                   </button>
                 </div>
                 
                 {/* Reviews Section */}
                 <div className="md:col-span-2">
                   <label className="block text-sm mb-2 text-right">نظرات محصول</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     <input
                       type="text"
                       placeholder="نام کاربر"
                       value={newProduct.reviewUser}
                       onChange={(e) => setNewProduct({ ...newProduct, reviewUser: e.target.value })}
                       className="border rounded-lg px-3 py-2"
                     />
                     <select
                       value={newProduct.reviewRating}
                       onChange={(e) => setNewProduct({ ...newProduct, reviewRating: e.target.value })}
                       className="border rounded-lg px-3 py-2"
                     >
                       <option value="5">⭐⭐⭐⭐⭐ (5 ستاره)</option>
                       <option value="4">⭐⭐⭐⭐ (4 ستاره)</option>
                       <option value="3">⭐⭐⭐ (3 ستاره)</option>
                       <option value="2">⭐⭐ (2 ستاره)</option>
                       <option value="1">⭐ (1 ستاره)</option>
                     </select>
                   </div>
                   <textarea
                     placeholder="نظر کاربر"
                     value={newProduct.reviewComment}
                     onChange={(e) => setNewProduct({ ...newProduct, reviewComment: e.target.value })}
                     rows={2}
                     className="w-full border rounded-lg px-3 py-2 mt-2"
                   />
                 </div>
                 
                 {/* Badge Selection */}
                 <div className="md:col-span-2">
                   <label className="block text-sm mb-2 text-right">انتخاب نشان‌های محصول</label>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                     <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                       <input
                         type="checkbox"
                         checked={newProduct.badges.discount}
                         onChange={(e) => setNewProduct({
                           ...newProduct,
                           badges: { ...newProduct.badges, discount: e.target.checked }
                         })}
                         className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                       />
                       <span className="text-sm text-gray-700">نشان تخفیف</span>
                     </label>
                     <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                       <input
                         type="checkbox"
                         checked={newProduct.badges.bestseller}
                         onChange={(e) => setNewProduct({
                           ...newProduct,
                           badges: { ...newProduct.badges, bestseller: e.target.checked }
                         })}
                         className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                       />
                       <span className="text-sm text-gray-700">پرفروش</span>
                     </label>
                     <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
                       <input
                         type="checkbox"
                         checked={newProduct.badges.new}
                         onChange={(e) => setNewProduct({
                           ...newProduct,
                           badges: { ...newProduct.badges, new: e.target.checked }
                         })}
                         className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                       />
                       <span className="text-sm text-gray-700">جدید</span>
                     </label>
                   </div>
                 </div>
                 
                 {/* مدیریت عکس اصلی محصول */}
                 <div className="md:col-span-2">
                   <label className="block text-sm mb-2 text-right">عکس اصلی محصول</label>
                   
                   {/* راهنمای عکس اصلی */}
                   <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                     <p className="text-xs text-blue-700 text-right">
                       💡 <strong>عکس اصلی:</strong> این عکس به عنوان تصویر اصلی محصول نمایش داده می‌شود
                     </p>
                   </div>
                   
                   {/* آپلود عکس اصلی */}
                   <div className="flex gap-2 items-center">
                     <input 
                       type="file" 
                       accept="image/*" 
                       onChange={handleImageUpload} 
                       className="flex-1" 
                       placeholder="انتخاب عکس اصلی"
                     />
                     {imagePreview && (
                       <button
                         type="button"
                         onClick={() => setImagePreview(null)}
                         className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                         title="پاک کردن عکس اصلی"
                       >
                         پاک کردن
                       </button>
                     )}
                   </div>
                   
                   {/* نمایش عکس اصلی انتخاب شده */}
                   {imagePreview && (
                     <div className="mt-3">
                       <p className="text-xs text-gray-600 mb-2 text-right">عکس اصلی انتخاب شده:</p>
                       <div className="relative inline-block">
                         <img 
                           src={imagePreview} 
                           alt="Main image preview" 
                           className="w-32 h-32 object-cover rounded border"
                         />
                         <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">اصلی</span>
                       </div>
                     </div>
                   )}
                   
                   {/* نمایش عکس اصلی فعلی (در حالت ویرایش) */}
                   {editingProduct && editingProduct.image && !imagePreview && (
                     <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                       <p className="text-xs text-gray-600 mb-2 text-right">عکس اصلی فعلی:</p>
                       <div className="relative inline-block">
                         <img 
                           src={editingProduct.image} 
                           alt="Current main image" 
                           className="w-32 h-32 object-cover rounded border"
                         />
                         <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">اصلی</span>
                       </div>
                     </div>
                   )}
                 </div>
                 
                 {/* مدیریت عکس‌های گالری */}
                 <div className="md:col-span-2">
                   <label className="block text-sm mb-2 text-right">عکس‌های گالری (حداکثر 4 عدد)</label>
                   
                   {/* راهنمای عکس‌های گالری */}
                   <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                     <p className="text-xs text-green-700 text-right">
                       💡 <strong>عکس‌های گالری:</strong> این عکس‌ها در صفحه جزئیات محصول به عنوان گالری نمایش داده می‌شوند<br/>
                       ⚠️ <strong>توجه:</strong> در ویرایش محصول، انتخاب عکس‌های جدید جایگزین عکس‌های قبلی می‌شود
                     </p>
                   </div>
                   
                   {/* آپلود عکس‌های گالری */}
                   <div className="flex gap-2 items-center">
                     <input 
                       type="file" 
                       accept="image/*" 
                       multiple 
                       onChange={handleImageFilesChange} 
                       className="flex-1" 
                       placeholder="انتخاب عکس‌های گالری"
                     />
                     {filePreviews.length > 0 && (
                       <button
                         type="button"
                         onClick={clearNewImageSelections}
                         className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                         title="پاک کردن عکس‌های گالری انتخاب شده"
                       >
                         پاک کردن
                       </button>
                     )}
                   </div>
                   
                   {/* نمایش عکس‌های گالری انتخاب شده */}
                   {filePreviews.length > 0 && (
                     <div className="mt-3">
                       <p className="text-xs text-gray-600 mb-2 text-right">عکس‌های گالری انتخاب شده:</p>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                         {filePreviews.map((url, idx) => (
                           <div key={idx} className="relative">
                             <img 
                               src={url} 
                               alt={`Gallery ${idx + 1}`} 
                               className="w-full h-20 object-cover rounded border"
                             />
                             <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] px-1 rounded">گالری</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* نمایش عکس‌های گالری فعلی (در حالت ویرایش) */}
                   {editingProduct && editingProduct.gallery_images && editingProduct.gallery_images.length > 0 && !filePreviews.length && (
                     <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                       <p className="text-xs text-gray-600 mb-2 text-right">عکس‌های گالری فعلی:</p>
                       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                         {editingProduct.gallery_images.map((img, idx) => (
                           <div key={idx} className="relative">
                             <img 
                               src={img} 
                               alt={`Gallery ${idx + 1}`} 
                               className="w-full h-20 object-cover rounded border"
                             />
                             <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] px-1 rounded">گالری</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {/* نمایش وضعیت عکس‌های فعلی محصول (در حالت ویرایش) */}
                   {editingProduct && (
                     <div className="mt-3 p-3 bg-blue-50 rounded-lg border">
                       <p className="text-xs text-blue-600 mb-2 text-right">وضعیت عکس‌های فعلی:</p>
                       <div className="text-xs text-blue-700 text-right whitespace-pre-line">
                         {getImageStatusMessage(editingProduct)}
                       </div>
                     </div>
                   )}
                 </div>
               </div>
               <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
                 {editingProduct ? (
                   <button onClick={handleUpdateProduct} disabled={addingProduct} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60">{addingProduct ? 'در حال بروزرسانی...' : 'بروزرسانی'}</button>
                 ) : (
                   <button onClick={handleAddProduct} disabled={addingProduct} className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">{addingProduct ? 'در حال ذخیره...' : 'افزودن محصول'}</button>
                 )}
                 <button onClick={() => {
                   setShowAddForm(false);
                   setEditingProduct(null);
                   clearAllImageSelections();
                   resetProductForm();
                 }} className="px-4 py-2 rounded bg-gray-500 text-white">انصراف</button>
               </div>
             </div>
           )}

           {/* Products List */}
           <div className="bg-white rounded-lg shadow-sm">
             <div className="p-4 border-b border-gray-200">
               <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-right">لیست محصولات ({filteredProducts.length})</h3>
             </div>
             {filteredProducts.length === 0 ? (
               <div className="p-6 text-center text-gray-500">محصولی یافت نشد</div>
             ) : (
               <div className="divide-y">
                 {filteredProducts.map((product) => (
                   <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                     <div className="flex-1 min-w-0">
                       <div className="font-semibold text-gray-800 truncate">{product.name}</div>
                       <div className="text-xs text-gray-500 truncate">{product.description}</div>
                       <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-2">
                         <span>قیمت: {formatPriceWithUnit(product.price)}</span>
                         {product.originalPrice && product.originalPrice !== product.price && (
                           <span className="line-through text-red-500">{formatPriceWithUnit(product.originalPrice)}</span>
                         )}
                         {product.brand && <span className="text-blue-600">{product.brand}</span>}
                         {product.category && <span className="text-purple-600">{product.category}</span>}
                         <span>موجودی: {product.stockCount || 0}</span>
                       </div>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto justify-end">
                       <button onClick={() => {
                         console.log('Edit product button clicked for:', product);
                         handleEditProduct(product);
                       }} className="px-3 py-1 rounded bg-blue-100 text-blue-600 text-sm">ویرایش</button>
                       <button onClick={()=>{ if (window.confirm('حذف این محصول؟')) handleDeleteProduct(product.id); }} className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm">حذف</button>
                     </div>
                   </div>
                 ))}
               </div>
             )}
           </div>

           </>
         ) : activeTab === 'brands' ? (
           <>
                           {/* Brands and Categories Management */}
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 w-full">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 text-right">مدیریت برندها، برندهای لنت و دسته‌بندی‌ها</h2>
                
                
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
                                   {/* Brands Management */}
                  <div className="bg-gray-50 rounded-lg p-4 w-full">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 text-right">برندها</h3>
                    
                    {/* دکمه نمایش لیست برندهای موجود */}
                    <div className="mb-3">
                      <button 
                        onClick={toggleExistingBrands}
                        className="bg-blue-100 text-blue-600 px-3 py-2 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        {showExistingBrands ? 'مخفی کردن لیست برندها' : 'نمایش لیست برندهای موجود'}
                      </button>
                    </div>
                    
                    {/* نمایش لیست برندهای موجود */}
                    {showExistingBrands && (
                      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2 text-right">لیست برندهای موجود:</h4>
                        <div className="mb-2 text-xs text-blue-600 text-right">
                          💡 قبل از افزودن برند جدید، این لیست را بررسی کنید تا از تکرار نام جلوگیری کنید
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-blue-700">
                          {defaultBrands.map((brand, index) => (
                            <div key={index} className="bg-white px-2 py-1 rounded border">
                              {brand.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2 w-full">
                      {defaultBrands.map((brand, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded w-full">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {brand.image ? (
                              <img 
                                src={brand.image} 
                                alt={brand.name} 
                                className="w-8 h-8 object-contain rounded flex-shrink-0 border border-gray-200"
                                onError={(e) => {
                                  e.target.src = '/default-brand.png';
                                  e.target.className = 'w-8 h-8 object-contain rounded flex-shrink-0 border border-gray-200 opacity-50';
                                }}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                🚗
                              </div>
                            )}
                            <span className="text-gray-800 text-sm md:text-base truncate">{brand.name}</span>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button 
                              onClick={() => handleBrandImageManagement(brand)}
                              className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-green-200"
                              title="مدیریت تصویر"
                            >
                              🖼️
                            </button>
                            <button 
                              onClick={() => handleEditBrand(brand, index)}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button 
                              onClick={() => { if (window.confirm('حذف این برند؟')) handleDeleteBrand(brand, index); }}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2 w-full">
                      <div className="text-xs text-gray-600 text-right mb-1">
                        💡 نام برند باید منحصر به فرد باشد
                      </div>
                      <input 
                        value={newBrand.name} 
                        onChange={(e)=>setNewBrand({...newBrand,name:e.target.value})} 
                        placeholder="نام برند جدید" 
                        className="w-full border rounded px-3 py-2 text-sm" 
                      />
                      <textarea 
                        value={newBrand.description} 
                        onChange={(e)=>setNewBrand({...newBrand,description:e.target.value})} 
                        placeholder="توضیحات برند (اختیاری)" 
                        className="w-full border rounded px-3 py-2 text-sm" 
                        rows={2}
                      />
                      <div className="space-y-2 w-full">
                        <label className="block text-sm text-gray-700 text-right">عکس برند (webp پیشنهاد می‌شود):</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleBrandImageUpload}
                          className="w-full text-sm"
                        />
                        {brandImagePreview && (
                          <div className="relative">
                            <img 
                              src={brandImagePreview} 
                              alt="Preview" 
                              className="w-16 h-16 object-contain border rounded"
                            />
                            <button
                              onClick={clearBrandImageSelection}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={editingBrand ? handleUpdateBrand : handleAddBrand} 
                        disabled={addingBrand || uploadingBrandImage} 
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base disabled:opacity-60"
                      >
                        {editingBrand ? 
                          (addingBrand || uploadingBrandImage ? 'در حال بروزرسانی...' : 'بروزرسانی برند') : 
                          (addingBrand || uploadingBrandImage ? 'در حال افزودن...' : '+ افزودن برند جدید')
                        }
                    </button>
                    </div>
                  </div>
                  
                  {/* Pad Brands Management */}
                  <div className="bg-gray-50 rounded-lg p-4 w-full">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 text-right">برندهای لنت</h3>
                    <div className="space-y-2 w-full">
                      {defaultPadBrands.map((padBrand, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded w-full">
                          <span className="text-gray-800 text-sm md:text-base truncate flex-1">{padBrand}</span>
                          <div className="flex gap-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditPadBrand(padBrand, index)}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button 
                              onClick={() => { if (window.confirm('حذف این برند لنت؟')) handleDeletePadBrand(padBrand, index); }}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2 w-full">
                      <input value={newPadBrand.name} onChange={(e)=>setNewPadBrand({...newPadBrand,name:e.target.value})} placeholder="نام برند لنت جدید" className="w-full border rounded px-3 py-2 text-sm" />
                      <button onClick={editingPadBrand ? handleUpdatePadBrand : handleAddPadBrand} disabled={addingPadBrand} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base">
                        {editingPadBrand ? (addingPadBrand ? 'در حال بروزرسانی...' : 'بروزرسانی برند لنت') : (addingPadBrand ? 'در حال افزودن...' : '+ افزودن برند لنت جدید')}
                    </button>
                    </div>
                  </div>

                  {/* Categories Management */}
                  <div className="bg-gray-50 rounded-lg p-4 w-full">
                    <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 text-right">دسته‌بندی‌ها</h3>
                    <div className="space-y-2 w-full">
                      {defaultCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded w-full">
                          <span className="text-gray-800 text-sm md:text-base truncate flex-1">{category}</span>
                          <div className="flex gap-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditCategory(category, index)}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button 
                              onClick={() => { if (window.confirm('حذف این دسته‌بندی؟')) handleDeleteCategory(category, index); }}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs md:text-sm hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 space-y-2 w-full">
                      <input value={newCategory.name} onChange={(e)=>setNewCategory({...newCategory,name:e.target.value})} placeholder="نام دسته‌بندی جدید" className="w-full border rounded px-3 py-2 text-sm" />
                      <button onClick={editingCategory ? handleUpdateCategory : handleAddCategory} disabled={addingCategory} className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-sm md:text-base">
                        {editingCategory ? (addingCategory ? 'در حال بروزرسانی...' : 'بروزرسانی دسته‌بندی') : (addingCategory ? 'در حال افزودن...' : '+ افزودن دسته‌بندی جدید')}
                    </button>
                  </div>
               </div>
                           </div>
                  </div>

              {/* باقی کد بدون تغییر */}
            </>

        ) : activeTab === 'price-editor' ? (
          <>
            {/* Price Editor */}
            <PriceEditor />
          </>
        ) : (
          <>
            {/* Backup Management */}
            <BackupManager />
          </>
        )}

        {/* Modal مدیریت تصاویر برندها */}
        {showBrandImageModal && selectedBrandForImage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 text-right">
                      مدیریت تصویر برند: {selectedBrandForImage.name}
                    </h3>
                    <button
                      onClick={() => setShowBrandImageModal(false)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      ×
                    </button>
                  </div>

                  {/* نمایش تصویر فعلی */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                      تصویر فعلی:
                    </label>
                    {selectedBrandForImage.image ? (
                      <div className="relative">
                        <img
                          src={selectedBrandForImage.image}
                          alt={selectedBrandForImage.name}
                          className="w-32 h-32 object-contain border rounded-lg mx-auto"
                          onError={(e) => {
                            e.target.src = '/default-brand.png';
                            e.target.className = 'w-32 h-32 object-contain border rounded-lg mx-auto opacity-50';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mx-auto">
                        <span className="text-4xl">🚗</span>
                      </div>
                    )}
                  </div>

                  {/* آپلود تصویر جدید */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 text-right mb-2">
                      تصویر جدید (webp پیشنهاد می‌شود):
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedBrandImage(file);
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setBrandImagePreview(e.target.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    {brandImagePreview && (
                      <div className="mt-3 relative">
                        <img
                          src={brandImagePreview}
                          alt="Preview"
                          className="w-24 h-24 object-contain border rounded mx-auto"
                        />
                        <button
                          onClick={() => {
                            setSelectedBrandImage(null);
                            setBrandImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* دکمه‌های عملیات */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setShowBrandImageModal(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      انصراف
                    </button>
                    {selectedBrandImage && (
                      <button
                        onClick={() => handleUpdateBrandImage(selectedBrandForImage.id, selectedBrandImage)}
                        disabled={uploadingBrandImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                      >
                        {uploadingBrandImage ? 'در حال آپلود...' : 'بروزرسانی تصویر'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AdminPanel;
