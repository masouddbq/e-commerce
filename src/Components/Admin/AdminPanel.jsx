import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    images: [],
    specifications: {},
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchStats();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: productsData } = await supabase
        .from("products")
        .select("category, stock");
      
      if (productsData) {
        const categories = new Set(productsData.map(p => p.category));
        const lowStockCount = productsData.filter(p => p.stock < 10).length;
        
        setStats({
          totalProducts: productsData.length,
          totalCategories: categories.size,
          lowStock: lowStockCount
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      setUploadingImages(true);
      
      // آپلود عکس‌ها
      let imageUrls = [];
      if (imageFiles.length > 0) {
        try {
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `product-images/${fileName}`;

                         const { error: uploadError } = await supabase.storage
               .from('products') // نام bucket که ساختی
               .upload(filePath, file);

             if (uploadError) {
               console.error("Storage upload error:", uploadError);
               throw new Error(`خطا در آپلود عکس: ${uploadError.message}`);
             }

             const { data: { publicUrl } } = supabase.storage
               .from('products') // نام bucket که ساختی
               .getPublicUrl(filePath);

            imageUrls.push(publicUrl);
          }
        } catch (storageError) {
          console.error("Storage error:", storageError);
          alert(`خطا در آپلود عکس‌ها: ${storageError.message}\n\nلطفاً مطمئن شوید که bucket storage در Supabase ایجاد شده است.`);
          setUploadingImages(false);
          return;
        }
      }

      // افزودن محصول با عکس‌ها
      const { error } = await supabase
        .from("products")
        .insert([{
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          images: imageUrls,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        brand: "",
        stock: "",
        images: [],
        specifications: {},
      });
      setImageFiles([]);
      setShowAddForm(false);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("خطا در افزودن محصول");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEditProduct = async (productId, updatedData) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          ...updatedData,
          price: parseFloat(updatedData.price),
          stock: parseInt(updatedData.stock),
          updated_at: new Date().toISOString()
        })
        .eq("id", productId);

      if (error) throw error;
      
      setEditingProduct(null);
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("خطا در بروزرسانی محصول");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        const { error } = await supabase
          .from("products")
          .delete()
          .eq("id", productId);

        if (error) throw error;
        
        fetchProducts();
        fetchStats();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("خطا در حذف محصول");
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-xl">در حال بارگذاری...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">پنل ادمین</h1>
          <p className="text-gray-600">مدیریت محصولات و سیستم</p>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">کل محصولات</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">دسته‌بندی‌ها</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">موجودی کم</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="جستجو در محصولات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">همه دسته‌ها</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + افزودن محصول جدید
            </button>
          </div>
        </div>

        {/* Add/Edit Product Form */}
        {(showAddForm || editingProduct) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="نام محصول"
                value={editingProduct ? editingProduct.name : newProduct.name}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, name: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, name: e.target.value });
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="قیمت (تومان)"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, price: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, price: e.target.value });
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="دسته‌بندی"
                value={editingProduct ? editingProduct.category : newProduct.category}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, category: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, category: e.target.value });
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="text"
                placeholder="برند"
                value={editingProduct ? editingProduct.brand : newProduct.brand}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, brand: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, brand: e.target.value });
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="موجودی"
                value={editingProduct ? editingProduct.stock : newProduct.stock}
                onChange={(e) => {
                  if (editingProduct) {
                    setEditingProduct({ ...editingProduct, stock: e.target.value });
                  } else {
                    setNewProduct({ ...newProduct, stock: e.target.value });
                  }
                }}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <textarea
              placeholder="توضیحات محصول"
              value={editingProduct ? editingProduct.description : newProduct.description}
              onChange={(e) => {
                if (editingProduct) {
                  setEditingProduct({ ...editingProduct, description: e.target.value });
                } else {
                  setNewProduct({ ...newProduct, description: e.target.value });
                }
              }}
              className="border border-gray-300 rounded-lg p-3 w-full mt-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />

            {/* Image Upload Section */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عکس‌های محصول
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImageFiles(files);
                  }}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  انتخاب عکس‌ها
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  می‌توانید چندین عکس انتخاب کنید
                </p>
              </div>
              
              {/* Preview Selected Images */}
              {imageFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">عکس‌های انتخاب شده:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => {
                            const newFiles = imageFiles.filter((_, i) => i !== index);
                            setImageFiles(newFiles);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  if (editingProduct) {
                    handleEditProduct(editingProduct.id, editingProduct);
                  } else {
                    handleAddProduct();
                  }
                }}
                disabled={uploadingImages}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  uploadingImages 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {uploadingImages ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    در حال آپلود...
                  </span>
                ) : (
                  editingProduct ? "بروزرسانی محصول" : "افزودن محصول"
                )}
              </button>

              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    description: "",
                    price: "",
                    category: "",
                    brand: "",
                    stock: "",
                    images: [],
                    specifications: {},
                  });
                  setImageFiles([]);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">لیست محصولات</h3>
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
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ display: product.images && product.images.length > 0 ? 'none' : 'flex' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{product.name}</h4>
                          <p className="text-gray-600 text-sm">{product.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-green-600 font-semibold">
                              {product.price?.toLocaleString()} تومان
                            </span>
                            <span className="text-blue-600 text-sm">{product.category}</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              موجودی: {product.stock}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
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
      </div>
    </div>
  );
};

export default AdminPanel;
