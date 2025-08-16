import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, uploadProductImage, deleteProductImage } from "../../lib/supabase";
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
  const [activeTab, setActiveTab] = useState('products'); // 'products' یا 'brands'
  
  // State برای مدیریت برندها و دسته‌بندی‌ها
  const [showAddBrandForm, setShowAddBrandForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newBrand, setNewBrand] = useState({ name: "", description: "" });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [addingBrand, setAddingBrand] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [showDeleteBrandConfirm, setShowDeleteBrandConfirm] = useState(null);
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(null);

  // State برای آپلود عکس
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // فرم محصول جدید - کامل
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    brand: "",
    padBrand: "",
    category: "",
    vehicleType: "", // اضافه کردن فیلد نوع خودرو
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
    image: "" // اضافه کردن فیلد عکس
  });

  // برندها و دسته‌بندی‌ها - حالا از دیتابیس
  const [defaultBrands, setDefaultBrands] = useState([]);
  const [defaultCategories, setDefaultCategories] = useState([]);

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
    
    // تنظیم real-time subscription
    const channel = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          console.log('Real-time change:', payload);
          fetchProducts(); // بروزرسانی خودکار
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'brands' }, 
        (payload) => {
          console.log('Real-time brands change:', payload);
          fetchBrands(); // بروزرسانی خودکار
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'categories' }, 
        (payload) => {
          console.log('Real-time categories change:', payload);
          fetchCategories(); // بروزرسانی خودکار
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  // دریافت محصولات از دیتابیس
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

  // دریافت برندها از دیتابیس
  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*");

      if (error) {
        console.error("Error fetching brands:", error);
        // اگر جدول وجود ندارد، برندهای پیش‌فرض را اضافه کن
        await initializeDefaultBrands();
      } else {
        setDefaultBrands(data.map(brand => brand.name) || []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      await initializeDefaultBrands();
    }
  };

  // دریافت دسته‌بندی‌ها از دیتابیس
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*");

      if (error) {
        console.error("Error fetching categories:", error);
        // اگر جدول وجود ندارد، دسته‌بندی‌های پیش‌فرض را اضافه کن
        await initializeDefaultCategories();
      } else {
        setDefaultCategories(data.map(category => category.name) || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      await initializeDefaultCategories();
    }
  };

  // راه‌اندازی برندهای پیش‌فرض
  const initializeDefaultBrands = async () => {
    const defaultBrandsList = [
      "تویوتا", "هیوندای", "نیسان", "کیا", "لکسوس", "جیلی", "مزدا", 
      "ام‌جی", "میتسوبیشی", "فولکس‌واگن", "سایپا", "سوزوکی", 
      "رنو", "پژو", "ایران خودرو", "فاو", "جی‌ای‌سی"
    ];

    try {
      // ابتدا سعی کن از جدول brands بخوانی
      const { data, error } = await supabase
        .from('brands')
        .select('*');

      if (error) {
        console.log("Brands table doesn't exist, using local state");
        // جدول وجود ندارد، از state محلی استفاده کن
        setDefaultBrands(defaultBrandsList);
        return;
      }

      if (data && data.length > 0) {
        // جدول وجود دارد و داده دارد
        setDefaultBrands(data.map(brand => brand.name));
      } else {
        // جدول وجود دارد اما خالی است، برندهای پیش‌فرض را اضافه کن
        const brandsData = defaultBrandsList.map(name => ({
          name,
          description: `برند ${name}`
        }));

        const { error: insertError } = await supabase
          .from("brands")
          .insert(brandsData);

        if (!insertError) {
          setDefaultBrands(defaultBrandsList);
        } else {
          console.error("Error inserting default brands:", insertError);
          setDefaultBrands(defaultBrandsList);
        }
      }
    } catch (error) {
      console.error("Error initializing brands:", error);
      // در صورت خطا، حداقل در state محلی نمایش بده
      setDefaultBrands(defaultBrandsList);
    }
  };

    // راه‌اندازی دسته‌بندی‌های پیش‌فرض
  const initializeDefaultCategories = async () => {
    const defaultCategoriesList = [
      "دیسکی", "کمپوزیتی", "سرامیکی", "فلزی", "پلاستیکی"
    ];

    try {
      // ابتدا سعی کن از جدول categories بخوانی
      const { data, error } = await supabase
        .from('categories')
        .select('*');

      if (error) {
        console.log("Categories table doesn't exist, using local state");
        // جدول وجود ندارد، از state محلی استفاده کن
        setDefaultCategories(defaultCategoriesList);
          return;
        }

      if (data && data.length > 0) {
        // جدول وجود دارد و داده دارد
        setDefaultCategories(data.map(category => category.name));
      } else {
        // جدول وجود دارد اما خالی است، دسته‌بندی‌های پیش‌فرض را اضافه کن
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
      // در صورت خطا، حداقل در state محلی نمایش بده
      setDefaultCategories(defaultCategoriesList);
    }
  };

  // توابع مربوط به آپلود عکس
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // بررسی نوع فایل
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('لطفاً فقط فایل تصویری انتخاب کنید. فرمت‌های مجاز: JPG, PNG, GIF, WebP');
        return;
      }
      
      // بررسی اندازه فایل (حداکثر 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }

      setSelectedImage(file);
      
      // نمایش preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImageSelection = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setNewProduct({...newProduct, image: ""});
  };

  const uploadImageToStorage = async (productId) => {
    if (!selectedImage) return null;
    
    try {
      setUploadingImage(true);
      const imageUrl = await uploadProductImage(selectedImage, productId);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('خطا در آپلود عکس: ' + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // افزودن محصول جدید - کامل
  const handleAddProduct = async () => {
    try {
      setAddingProduct(true);
      
      // ابتدا عکس را آپلود کن (اگر انتخاب شده باشد)
      let imageUrl = "";
      if (selectedImage) {
        // ایجاد یک ID موقت برای آپلود عکس
        const tempId = Date.now();
        imageUrl = await uploadImageToStorage(tempId);
        if (!imageUrl) {
          alert('خطا در آپلود عکس. لطفاً دوباره تلاش کنید.');
          return;
        }
      }
      
      // آماده‌سازی داده‌های محصول
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice || newProduct.price,
        brand: newProduct.brand,
        category: newProduct.category,
        vehicleType: newProduct.vehicleType, // اضافه کردن نوع خودرو
        suitableFor: newProduct.suitableFor,
        stockStatus: newProduct.stockStatus,
        stockCount: parseInt(newProduct.stockCount) || 0,
        description: newProduct.description,
        image: imageUrl, // استفاده از URL عکس آپلود شده
        specifications: {
          material: newProduct.material,
          thickness: newProduct.thickness,
          weight: newProduct.weight,
          temperature: newProduct.temperature,
          warranty: newProduct.warranty
        },
        features: newProduct.features.filter(f => f.trim() !== ""),
        reviews: [{
          id: Date.now(),
          user: newProduct.reviewUser,
          rating: parseInt(newProduct.reviewRating),
          comment: newProduct.reviewComment,
          date: newProduct.reviewDate || new Date().toLocaleDateString('fa-IR')
        }],
        created_at: new Date().toISOString()
      };

      // فقط در صورتی که ستون در DB وجود داشته باشد، درج موفق می‌شود.
      // برای جلوگیری از خطا در حالت عدم وجود ستون، کلید را فقط در صورت مقداردهی اضافه می‌کنیم.
      if (newProduct.padBrand) {
        // از نام ستون lowercase نیز پشتیبانی می‌کنیم
        productData.padbrand = newProduct.padBrand;
      }

      // افزودن به دیتابیس
      const { data, error } = await supabase
        .from("products")
        .insert([productData]);

      if (error) throw error;
      
      // اگر عکس آپلود شده، نام فایل را با ID واقعی محصول آپدیت کن
      if (imageUrl && data && data[0]) {
        const realProductId = data[0].id;
        // اینجا می‌توانیم نام فایل را تغییر دهیم اگر نیاز باشد
        // فعلاً همان URL قبلی استفاده می‌شود
      }
      
      // پاک کردن فرم
      setNewProduct({
        name: "",
        price: "",
        originalPrice: "",
        brand: "",
        padBrand: "",
        category: "",
        vehicleType: "", // پاک کردن نوع خودرو
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
        image: "" // پاک کردن عکس فرم
      });
      
      // پاک کردن انتخاب عکس
      clearImageSelection();
      
      setShowAddForm(false);
      
      // بروزرسانی لیست (realtime)
      await fetchProducts();
      
      alert("محصول با موفقیت اضافه شد!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("خطا در افزودن محصول: " + error.message);
    } finally {
      setAddingProduct(false);
    }
  };

  // ویرایش محصول
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || "",
      price: product.price || "",
      originalPrice: product.originalPrice || "",
      brand: product.brand || "",
      padBrand: product.padBrand || product.padbrand || "",
      category: product.category || "",
      vehicleType: product.vehicleType || "", // اضافه کردن نوع خودرو
      suitableFor: product.suitableFor || "",
      stockStatus: product.stockStatus || "موجود",
      stockCount: product.stockCount || "",
      description: product.description || "",
      material: product.specifications?.material || "",
      thickness: product.specifications?.thickness || "",
      weight: product.specifications?.weight || "",
      temperature: product.specifications?.temperature || "",
      warranty: product.specifications?.warranty || "",
      features: product.features && product.features.length > 0 ? product.features : [""],
      reviewUser: product.reviews && product.reviews.length > 0 ? product.reviews[0].user : "",
      reviewRating: product.reviews && product.reviews.length > 0 ? product.reviews[0].rating : 5,
      reviewComment: product.reviews && product.reviews.length > 0 ? product.reviews[0].comment : "",
      reviewDate: product.reviews && product.reviews.length > 0 ? product.reviews[0].date : "",
      image: product.image || "" // ذخیره عکس محصول ویرایش شده
    });
    
    // نمایش عکس موجود در preview
    if (product.image) {
      setImagePreview(product.image);
    } else {
      setImagePreview(null);
    }
    
    // پاک کردن انتخاب عکس جدید
    setSelectedImage(null);
    
    setShowAddForm(true);
  };

  // بروزرسانی محصول
  const handleUpdateProduct = async () => {
    try {
      setAddingProduct(true);
      
      let imageUrl = editingProduct.image; // استفاده از عکس موجود
      
      // اگر عکس جدید انتخاب شده، آن را آپلود کن
      if (selectedImage) {
        const newImageUrl = await uploadImageToStorage(editingProduct.id);
        if (newImageUrl) {
          imageUrl = newImageUrl;
          
          // حذف عکس قدیمی (اگر وجود داشته باشد)
          if (editingProduct.image) {
            await deleteProductImage(editingProduct.image);
          }
        } else {
          alert('خطا در آپلود عکس جدید. لطفاً دوباره تلاش کنید.');
          return;
        }
      }
      
      const productData = {
        name: newProduct.name,
        price: newProduct.price,
        originalPrice: newProduct.originalPrice || newProduct.price,
        brand: newProduct.brand,
        category: newProduct.category,
        vehicleType: newProduct.vehicleType, // اضافه کردن نوع خودرو
        suitableFor: newProduct.suitableFor,
        stockStatus: newProduct.stockStatus,
        stockCount: parseInt(newProduct.stockCount) || 0,
        description: newProduct.description,
        image: imageUrl, // استفاده از عکس جدید یا موجود
        specifications: {
          material: newProduct.material,
          thickness: newProduct.thickness,
          weight: newProduct.weight,
          temperature: newProduct.temperature,
          warranty: newProduct.warranty
        },
        features: newProduct.features.filter(f => f.trim() !== ""),
        reviews: [{
          id: Date.now(),
          user: newProduct.reviewUser,
          rating: parseInt(newProduct.reviewRating),
          comment: newProduct.reviewComment,
          date: newProduct.reviewDate || new Date().toLocaleDateString('fa-IR')
        }],
        updated_at: new Date().toISOString()
      };

      if (newProduct.padBrand) {
        productData.padbrand = newProduct.padBrand;
      }

      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", editingProduct.id);

      if (error) throw error;
      
      // پاک کردن فرم و حالت ویرایش
      setNewProduct({
        name: "",
        price: "",
        originalPrice: "",
        brand: "",
        padBrand: "",
        category: "",
        vehicleType: "", // پاک کردن نوع خودرو
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
        image: "" // پاک کردن عکس فرم ویرایش شده
      });
      
      // پاک کردن انتخاب عکس
      clearImageSelection();
      
      setEditingProduct(null);
      setShowAddForm(false);
      
      await fetchProducts();
      alert("محصول با موفقیت بروزرسانی شد!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("خطا در بروزرسانی محصول: " + error.message);
    } finally {
      setAddingProduct(false);
    }
  };

  // حذف محصول
  const handleDeleteProduct = async (productId) => {
      try {
      setDeletingProduct(true);
      
      // ابتدا عکس محصول را از storage حذف کن
      const productToDelete = products.find(p => p.id === productId);
      if (productToDelete && productToDelete.image) {
        await deleteProductImage(productToDelete.image);
      }
      
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) throw error;
        
      await fetchProducts();
      alert("محصول با موفقیت حذف شد!");
      } catch (error) {
        console.error("Error deleting product:", error);
      alert("خطا در حذف محصول: " + error.message);
    } finally {
      setDeletingProduct(false);
      setShowDeleteConfirm(null);
    }
  };

  // خروج از سیستم
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  // ===== مدیریت برندها =====
  const handleAddBrand = async () => {
    try {
      setAddingBrand(true);
      
      if (!newBrand.name.trim()) {
        alert("نام برند الزامی است!");
        return;
      }

      // بررسی تکراری نبودن نام برند
      if (defaultBrands.includes(newBrand.name.trim())) {
        alert("این برند قبلاً وجود دارد!");
        return;
      }

      // اضافه کردن به دیتابیس
      const { error } = await supabase
        .from("brands")
        .insert([{
          name: newBrand.name.trim(),
          description: newBrand.description || `برند ${newBrand.name.trim()}`
        }]);

      if (error) {
        // اگر خطا مربوط به عدم وجود جدول است، ابتدا جدول را ایجاد کن
        if (error.code === '42P01') {
          console.log("Brands table doesn't exist, creating it first...");
          
          // ابتدا برند را به state محلی اضافه کن
          setDefaultBrands([...defaultBrands, newBrand.name.trim()]);
          setNewBrand({ name: "", description: "" });
          setShowAddBrandForm(false);
          alert("برند به لیست محلی اضافه شد. لطفاً ابتدا جدول brands را در Supabase ایجاد کنید.");
          return;
        }
        throw error;
      }

      // بروزرسانی state
      setDefaultBrands([...defaultBrands, newBrand.name.trim()]);
      
      setNewBrand({ name: "", description: "" });
      setShowAddBrandForm(false);
      alert("برند با موفقیت اضافه شد!");
    } catch (error) {
      console.error("Error adding brand:", error);
      alert("خطا در افزودن برند: " + error.message);
    } finally {
      setAddingBrand(false);
    }
  };

  const handleEditBrand = (brand, index) => {
    setEditingBrand({ ...brand, index });
    setNewBrand({ name: brand, description: "" });
    setShowAddBrandForm(true);
  };

  const handleUpdateBrand = async () => {
    try {
      setAddingBrand(true);
      
      if (!newBrand.name.trim()) {
        alert("نام برند الزامی است!");
        return;
      }

      // بروزرسانی در دیتابیس
      const { error } = await supabase
        .from("brands")
        .update({
          name: newBrand.name.trim(),
          description: newBrand.description || `برند ${newBrand.name.trim()}`
        })
        .eq("name", editingBrand.brand);

      if (error) throw error;

      // بروزرسانی در state
      const updatedBrands = [...defaultBrands];
      updatedBrands[editingBrand.index] = newBrand.name.trim();
      setDefaultBrands(updatedBrands);
      
      setNewBrand({ name: "", description: "" });
      setEditingBrand(null);
      setShowAddBrandForm(false);
      alert("برند با موفقیت بروزرسانی شد!");
    } catch (error) {
      console.error("Error updating brand:", error);
      alert("خطا در بروزرسانی برند: " + error.message);
    } finally {
      setAddingBrand(false);
    }
  };

  const handleDeleteBrand = async (brand, index) => {
    try {
      setDeletingBrand(true);
      
      // حذف از دیتابیس
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("name", brand);

      if (error) throw error;

      // حذف از state
      const updatedBrands = defaultBrands.filter((_, i) => i !== index);
      setDefaultBrands(updatedBrands);
      
      setShowDeleteBrandConfirm(null);
      alert("برند با موفقیت حذف شد!");
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert("خطا در حذف برند: " + error.message);
    } finally {
      setDeletingBrand(false);
    }
  };

  // ===== مدیریت دسته‌بندی‌ها =====
  const handleAddCategory = async () => {
    try {
      setAddingCategory(true);
      
      if (!newCategory.name.trim()) {
        alert("نام دسته‌بندی الزامی است!");
        return;
      }

      // بررسی تکراری نبودن نام دسته‌بندی
      if (defaultCategories.includes(newCategory.name.trim())) {
        alert("این دسته‌بندی قبلاً وجود دارد!");
        return;
      }

      // اضافه کردن به دیتابیس
      const { error } = await supabase
        .from("categories")
        .insert([{
          name: newCategory.name.trim(),
          description: newCategory.description || `دسته‌بندی ${newCategory.name.trim()}`
        }]);

      if (error) throw error;

      // اضافه کردن به state
      setDefaultCategories([...defaultCategories, newCategory.name.trim()]);
      
      setNewCategory({ name: "", description: "" });
      setShowAddCategoryForm(false);
      alert("دسته‌بندی با موفقیت اضافه شد!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("خطا در افزودن دسته‌بندی: " + error.message);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleEditCategory = (category, index) => {
    setEditingCategory({ ...category, index });
    setNewCategory({ name: category, description: "" });
    setShowAddCategoryForm(true);
  };

  const handleUpdateCategory = async () => {
    try {
      setAddingCategory(true);
      
      if (!newCategory.name.trim()) {
        alert("نام دسته‌بندی الزامی است!");
        return;
      }

      // بروزرسانی در دیتابیس
      const { error } = await supabase
        .from("categories")
        .update({
          name: newCategory.name.trim(),
          description: newCategory.description || `دسته‌بندی ${newCategory.name.trim()}`
        })
        .eq("name", editingCategory.category);

      if (error) throw error;

      // بروزرسانی در state
      const updatedCategories = [...defaultCategories];
      updatedCategories[editingCategory.index] = newCategory.name.trim();
      setDefaultCategories(updatedCategories);
      
      setNewCategory({ name: "", description: "" });
      setEditingCategory(null);
      setShowAddCategoryForm(false);
      alert("دسته‌بندی با موفقیت بروزرسانی شد!");
    } catch (error) {
      console.error("Error updating category:", error);
      console.error("Error updating category:", error);
      alert("خطا در بروزرسانی دسته‌بندی: " + error.message);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (category, index) => {
    try {
      setDeletingCategory(true);
      
      // حذف از دیتابیس
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("name", category);

      if (error) throw error;

      // حذف از state
      const updatedCategories = defaultCategories.filter((_, i) => i !== index);
      setDefaultCategories(updatedCategories);
      
      setShowDeleteCategoryConfirm(null);
      alert("دسته‌بندی با موفقیت حذف شد!");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("خطا در حذف دسته‌بندی: " + error.message);
    } finally {
      setDeletingCategory(false);
    }
  };

  // فیلتر کردن محصولات
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  const productBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const productCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">در حال بارگذاری...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
             <div className="bg-white shadow-sm border-b">
         <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">پنل ادمین</h1>
              <p className="text-sm text-gray-600">مدیریت محصولات لنت شاپ</p>
        </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              خروج
            </button>
              </div>
            </div>
          </div>

             <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
         {/* Tab Navigation */}
         <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
           <div className="flex space-x-1 space-x-reverse">
             <button
               onClick={() => setActiveTab('products')}
               className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                 activeTab === 'products'
                   ? 'bg-blue-600 text-white'
                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
               }`}
             >
               مدیریت محصولات
             </button>
             <button
               onClick={() => setActiveTab('brands')}
               className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                 activeTab === 'brands'
                   ? 'bg-blue-600 text-white'
                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
               }`}
             >
               مدیریت برندها و دسته‌بندی‌ها
             </button>
            </div>
          </div>

                  {/* Conditional Content Based on Active Tab */}
         {activeTab === 'products' ? (
           <>
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="جستجو در محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
            </div>
                 <div className="md:w-48">
                   <select
                     value={selectedBrand}
                     onChange={(e) => setSelectedBrand(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                   >
                     <option value="">همه برندها</option>
                                           {productBrands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                   </select>
                 </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              >
                <option value="">همه دسته‌ها</option>
                                           {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                   + افزودن محصول
            </button>
          </div>
        </div>
           </>
         ) : (
           <>
                           {/* Brands and Categories Management */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-right">مدیریت برندها و دسته‌بندی‌ها</h2>
                
                
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   {/* Brands Management */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">برندها</h3>
                    <div className="space-y-2">
                      {defaultBrands.map((brand, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-gray-800">{brand}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEditBrand(brand, index)}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button 
                              onClick={() => setShowDeleteBrandConfirm({ brand, index })}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowAddBrandForm(true)}
                      className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      + افزودن برند جدید
                    </button>
                  </div>
                  
                  {/* Categories Management */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 text-right">دسته‌بندی‌ها</h3>
                    <div className="space-y-2">
                      {defaultCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                          <span className="text-gray-800">{category}</span>
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleEditCategory(category, index)}
                              className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200"
                            >
                              ویرایش
                            </button>
                            <button 
                              onClick={() => setShowDeleteCategoryConfirm({ category, index })}
                              className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => setShowAddCategoryForm(true)}
                      className="w-full mt-3 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      + افزودن دسته‌بندی جدید
                    </button>
                  </div>
               </div>
                           </div>

              {/* فرم افزودن/ویرایش برند */}
              {showAddBrandForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-right">
                      {editingBrand ? 'ویرایش برند' : 'افزودن برند جدید'}
            </h2>
                    <button
                      onClick={() => {
                        setShowAddBrandForm(false);
                        setEditingBrand(null);
                        setNewBrand({ name: "", description: "" });
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="نام برند"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right w-full"
                    />

                    <textarea
                      placeholder="توضیحات برند (اختیاری)"
                      value={newBrand.description}
                      onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right w-full"
                      rows="3"
                    />
                  </div>

                  <div className="mt-6 flex gap-2 justify-end">
                    {editingBrand ? (
                      <button
                        onClick={handleUpdateBrand}
                        disabled={addingBrand}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          addingBrand 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {addingBrand ? "در حال بروزرسانی..." : "بروزرسانی برند"}
                      </button>
                    ) : (
                      <button
                        onClick={handleAddBrand}
                        disabled={addingBrand}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          addingBrand 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        {addingBrand ? "در حال ذخیره..." : "افزودن برند"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowAddBrandForm(false);
                        setEditingBrand(null);
                        setNewBrand({ name: "", description: "" });
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              )}

              {/* فرم افزودن/ویرایش دسته‌بندی */}
              {showAddCategoryForm && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-right">
                      {editingCategory ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAddCategoryForm(false);
                        setEditingCategory(null);
                        setNewCategory({ name: "", description: "" });
                      }}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="نام دسته‌بندی"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right w-full"
                    />

                    <textarea
                      placeholder="توضیحات دسته‌بندی (اختیاری)"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right w-full"
                      rows="3"
                    />
                  </div>

                  <div className="mt-6 flex gap-2 justify-end">
                    {editingCategory ? (
                      <button
                        onClick={handleUpdateCategory}
                        disabled={addingCategory}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          addingCategory 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-green-600 hover:bg-green-700'
                        } text-white`}
                      >
                        {addingCategory ? "در حال بروزرسانی..." : "بروزرسانی دسته‌بندی"}
                      </button>
                    ) : (
                      <button
                        onClick={handleAddCategory}
                        disabled={addingCategory}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                          addingCategory 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                      >
                        {addingCategory ? "در حال ذخیره..." : "افزودن دسته‌بندی"}
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowAddCategoryForm(false);
                        setEditingCategory(null);
                        setNewCategory({ name: "", description: "" });
                      }}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

                 {/* Add/Edit Product Form - کامل */}
         {activeTab === 'products' && showAddForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-right">
                {editingProduct ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    price: "",
                    originalPrice: "",
                    brand: "",
                    padBrand: "",
                    category: "",
                    vehicleType: "", // پاک کردن نوع خودرو
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
                    image: "" // پاک کردن عکس فرم جدید
                  });
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* اطلاعات اصلی */}
              <div className="space-y-4">
              <input
                type="text"
                placeholder="نام محصول"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />

              <input
                  type="text"
                placeholder="قیمت (تومان)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />

              <input
                type="text"
                  placeholder="قیمت اصلی (اختیاری)"
                  value={newProduct.originalPrice}
                  onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                <select
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">انتخاب برند</option>
                  <option value="تویوتا">تویوتا</option>
                  <option value="هیوندای">هیوندای</option>
                  <option value="نیسان">نیسان</option>
                  <option value="کیا">کیا</option>
                  <option value="لکسوس">لکسوس</option>
                  <option value="جیلی">جیلی</option>
                  <option value="مزدا">مزدا</option>
                  <option value="ام‌جی">ام‌جی</option>
                  <option value="میتسوبیشی">میتسوبیشی</option>
                  <option value="فولکس‌واگن">فولکس‌واگن</option>
                  <option value="سایپا">سایپا</option>
                  <option value="سوزوکی">سوزوکی</option>
                  <option value="رنو">رنو</option>
                  <option value="پژو">پژو</option>
                  <option value="ایران خودرو">ایران خودرو</option>
                  <option value="فاو">فاو</option>
                  <option value="جی‌ای‌سی">جی‌ای‌سی</option>
                </select>

                <select
                  value={newProduct.padBrand}
                  onChange={(e) => setNewProduct({...newProduct, padBrand: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">انتخاب برند لنت</option>
                  <option value="آفورتیس">آفورتیس</option>
                  <option value="آسیمکو">آسیمکو</option>
                  <option value="امکو">امکو</option>
                </select>

                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">انتخاب دسته‌بندی</option>
                  <option value="دیسکی">دیسکی</option>
                  <option value="کفشکی">کفشکی</option>
                  <option value="لنت ترمز جلو">لنت ترمز جلو</option>
                  <option value="لنت ترمز عقب">لنت ترمز عقب</option>
                </select>

                <select
                  value={newProduct.vehicleType}
                  onChange={(e) => setNewProduct({...newProduct, vehicleType: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                >
                  <option value="">انتخاب نوع خودرو</option>
                  <option value="سواری">سواری</option>
                  <option value="شاسی بلند">شاسی بلند</option>
                  <option value="دیزل">دیزل</option>
                </select>

              <input
                type="text"
                  placeholder="مناسب برای چه خودروهایی"
                  value={newProduct.suitableFor}
                  onChange={(e) => setNewProduct({...newProduct, suitableFor: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                                 <select
                   value={newProduct.stockStatus}
                   onChange={(e) => setNewProduct({...newProduct, stockStatus: e.target.value})}
                   className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                 >
                   <option value="موجود">موجود</option>
                   <option value="اتمام موجودی">اتمام موجودی</option>
                 </select>

                 {newProduct.stockStatus === "موجود" && (
              <input
                type="number"
                     placeholder="تعداد موجودی"
                     value={newProduct.stockCount}
                     onChange={(e) => setNewProduct({...newProduct, stockCount: e.target.value})}
                     className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                   />
                 )}
            </div>

              {/* مشخصات فنی */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">مشخصات فنی محصول</label>
                
                <input
                  type="text"
                  placeholder="جنس لنت (مثل: کامپوزیت آلی، سرامیکی)"
                  value={newProduct.material}
                  onChange={(e) => setNewProduct({...newProduct, material: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                <input
                  type="text"
                  placeholder="ضخامت (مثل: 11.5 میلی‌متر)"
                  value={newProduct.thickness}
                  onChange={(e) => setNewProduct({...newProduct, thickness: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                <input
                  type="text"
                  placeholder="وزن (مثل: 400 گرم)"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                <input
                  type="text"
                  placeholder="دمای مقاوم (مثل: تا 350 درجه سانتیگراد)"
                  value={newProduct.temperature}
                  onChange={(e) => setNewProduct({...newProduct, temperature: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />

                <input
                  type="text"
                  placeholder="گارانتی (مثل: 15 ماه)"
                  value={newProduct.warranty}
                  onChange={(e) => setNewProduct({...newProduct, warranty: e.target.value})}
                  className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                />
              </div>
            </div>

            {/* توضیحات */}
            <div className="mt-4">
            <textarea
              placeholder="توضیحات محصول"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              rows="3"
            />
            </div>

            {/* ویژگی‌ها */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">ویژگی‌های محصول</label>
              {newProduct.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mb-2">
                <input
                    type="text"
                    placeholder={`ویژگی ${index + 1}`}
                    value={feature}
                  onChange={(e) => {
                      const newFeatures = [...newProduct.features];
                      newFeatures[index] = e.target.value;
                      setNewProduct({...newProduct, features: newFeatures});
                    }}
                    className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                  />
                  {newProduct.features.length > 1 && (
                        <button
                          onClick={() => {
                        const newFeatures = newProduct.features.filter((_, i) => i !== index);
                        setNewProduct({...newProduct, features: newFeatures});
                          }}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                        >
                      حذف
                        </button>
                  )}
                      </div>
                    ))}
              <button
                onClick={() => setNewProduct({...newProduct, features: [...newProduct.features, ""]})}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm"
              >
                + افزودن ویژگی
              </button>
                  </div>

            {/* نظرات */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="نام کاربر"
                value={newProduct.reviewUser}
                onChange={(e) => setNewProduct({...newProduct, reviewUser: e.target.value})}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />

              <select
                value={newProduct.reviewRating}
                onChange={(e) => setNewProduct({...newProduct, reviewRating: e.target.value})}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              >
                <option value="5">5 ستاره</option>
                <option value="4">4 ستاره</option>
                <option value="3">3 ستاره</option>
                <option value="2">2 ستاره</option>
                <option value="1">1 ستاره</option>
              </select>

              <input
                type="text"
                placeholder="نظر کاربر"
                value={newProduct.reviewComment}
                onChange={(e) => setNewProduct({...newProduct, reviewComment: e.target.value})}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />

              <input
                type="text"
                placeholder="تاریخ نظر (اختیاری)"
                value={newProduct.reviewDate}
                onChange={(e) => setNewProduct({...newProduct, reviewDate: e.target.value})}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
            </div>

            {/* آپلود عکس */}
            <div className="mt-4">
              <label htmlFor="product-image" className="block text-sm font-medium text-gray-700 mb-2 text-right">عکس محصول (اختیاری)</label>
              
              {/* نمایش عکس موجود یا انتخاب شده */}
              {imagePreview && (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img 
                      src={imagePreview} 
                      alt="Product Preview" 
                      className="max-w-sm h-auto rounded-lg border-2 border-gray-200 shadow-sm" 
                    />
                    <button
                      type="button"
                      onClick={clearImageSelection}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors text-sm"
                      title="حذف عکس"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 text-center">عکس انتخاب شده</p>
                </div>
              )}
              
              {/* آپلود عکس جدید */}
              {!imagePreview && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="product-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label 
                    htmlFor="product-image" 
                    className="cursor-pointer block"
                  >
                    <div className="text-gray-600">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">برای انتخاب عکس کلیک کنید</p>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF, WebP تا 5MB</p>
                    </div>
                  </label>
                </div>
              )}
              
              {/* نمایش وضعیت آپلود */}
              {uploadingImage && (
                <div className="mt-2 text-center">
                  <div className="inline-flex items-center text-sm text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    در حال آپلود عکس...
                  </div>
                </div>
              )}
            </div>

            {/* دکمه‌های عملیات */}
            <div className="mt-6 flex gap-2 justify-end">
              {editingProduct ? (
              <button
                  onClick={handleUpdateProduct}
                  disabled={addingProduct}
                className={`px-6 py-2 rounded-lg transition-colors ${
                    addingProduct 
                    ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                } text-white`}
              >
                  {addingProduct ? "در حال بروزرسانی..." : "بروزرسانی محصول"}
                </button>
              ) : (
                <button
                  onClick={handleAddProduct}
                  disabled={addingProduct}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    addingProduct 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {addingProduct ? "در حال ذخیره..." : "افزودن محصول"}
              </button>
              )}

              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    price: "",
                    originalPrice: "",
                    brand: "",
                    padBrand: "",
                    category: "",
                    vehicleType: "", // پاک کردن نوع خودرو
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
                    image: "" // پاک کردن عکس فرم جدید
                  });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

                          {/* Delete Confirmation Modal */}
         {activeTab === 'products' && showDeleteConfirm && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 max-w-md mx-4">
               <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">تأیید حذف</h3>
               <p className="text-gray-600 mb-6 text-right">
                 آیا از حذف این محصول اطمینان دارید؟ این عملیات قابل بازگشت نیست.
               </p>
               <div className="flex gap-3 justify-end">
                 <button
                   onClick={() => setShowDeleteConfirm(null)}
                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                 >
                   انصراف
                 </button>
                 <button
                   onClick={() => handleDeleteProduct(showDeleteConfirm)}
                   disabled={deletingProduct}
                   className={`px-4 py-2 rounded-lg transition-colors ${
                     deletingProduct 
                       ? 'bg-red-400 cursor-not-allowed' 
                       : 'bg-red-600 hover:bg-red-700'
                   } text-white`}
                 >
                   {deletingProduct ? "در حال حذف..." : "حذف"}
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Delete Brand Confirmation Modal */}
         {showDeleteBrandConfirm && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 max-w-md mx-4">
               <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">تأیید حذف برند</h3>
               <p className="text-gray-600 mb-6 text-right">
                 آیا از حذف برند "{showDeleteBrandConfirm.brand}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
               </p>
               <div className="flex gap-3 justify-end">
                 <button
                   onClick={() => setShowDeleteBrandConfirm(null)}
                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                 >
                   انصراف
                 </button>
                 <button
                   onClick={() => handleDeleteBrand(showDeleteBrandConfirm.brand, showDeleteBrandConfirm.index)}
                   disabled={deletingBrand}
                   className={`px-4 py-2 rounded-lg transition-colors ${
                     deletingBrand 
                       ? 'bg-red-400 cursor-not-allowed' 
                       : 'bg-red-600 hover:bg-red-700'
                   } text-white`}
                 >
                   {deletingBrand ? "در حال حذف..." : "حذف"}
                 </button>
               </div>
             </div>
           </div>
         )}

         {/* Delete Category Confirmation Modal */}
         {showDeleteCategoryConfirm && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 max-w-md mx-4">
               <h3 className="text-lg font-semibold text-gray-800 mb-4 text-right">تأیید حذف دسته‌بندی</h3>
               <p className="text-gray-600 mb-6 text-right">
                 آیا از حذف دسته‌بندی "{showDeleteCategoryConfirm.category}" اطمینان دارید؟ این عملیات قابل بازگشت نیست.
               </p>
               <div className="flex gap-3 justify-end">
                 <button
                   onClick={() => setShowDeleteCategoryConfirm(null)}
                   className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                 >
                   انصراف
                 </button>
                 <button
                   onClick={() => handleDeleteCategory(showDeleteCategoryConfirm.category, showDeleteCategoryConfirm.index)}
                   disabled={deletingCategory}
                   className={`px-4 py-2 rounded-lg transition-colors ${
                     deletingCategory 
                       ? 'bg-red-400 cursor-not-allowed' 
                       : 'bg-red-600 hover:bg-red-700'
                   } text-white`}
                 >
                   {deletingCategory ? "در حال حذف..." : "حذف"}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* Products List */}
         {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
               <h3 className="text-lg font-semibold text-gray-800 text-right">لیست محصولات ({products.length})</h3>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              محصولی یافت نشد
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                         <h4 className="text-lg font-semibold text-gray-800 text-right">{product.name}</h4>
                         <p className="text-gray-600 text-sm text-right">{product.description}</p>
                         <div className="flex items-center gap-4 mt-2 text-right">
                            <span className="text-green-600 font-semibold">
                             {formatPriceWithUnit(product.price)} تومان
                            </span>
                           {product.originalPrice && product.originalPrice !== product.price && (
                             <span className="text-red-500 line-through text-sm">
                               {formatPriceWithUnit(product.originalPrice)} تومان
                             </span>
                           )}
                           <span className="text-blue-600 text-sm">{product.brand}</span>
                           {product.padBrand && (
                             <span className="text-pink-600 text-sm">{product.padBrand}</span>
                           )}
                           <span className="text-purple-600 text-sm">{product.category}</span>
                           {product.vehicleType && (
                             <span className="text-orange-600 text-sm">{product.vehicleType}</span>
                           )}
                            <span className={`text-sm px-2 py-1 rounded-full ${
                             product.stockCount > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                             موجودی: {product.stockCount}
                            </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                           onClick={() => handleEditProduct(product)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        ویرایش
                      </button>
                      <button
                           onClick={() => setShowDeleteConfirm(product.id)}
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;
