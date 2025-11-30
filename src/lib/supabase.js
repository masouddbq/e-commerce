import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Only create client if we have valid credentials
let supabase = null

try {
  if (supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && 
      supabaseAnonKey && supabaseAnonKey !== 'placeholder-key') {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
} catch (error) {
  console.warn('Supabase client creation failed:', error)
}

// Storage bucket name for product images
export const PRODUCT_IMAGES_BUCKET = 'product-images'

// Storage bucket name for brand images
export const BRAND_IMAGES_BUCKET = 'brand-images'

// Helper function to upload image
export const uploadProductImage = async (file, productId) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: JPG, PNG, GIF, WebP')
    }
    
    // Create unique filename
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `${productId}-${Date.now()}.${fileExt}`
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

// Helper function to upload brand image
export const uploadBrandImage = async (file, brandId) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    // بررسی نوع فایل
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('فرمت فایل پشتیبانی نمی‌شود. فرمت‌های مجاز: JPG, PNG, GIF, WebP')
    }
    
    // تبدیل نام فارسی برند به انگلیسی و حذف کاراکترهای غیرمجاز
    const getBrandSlug = (brandName) => {
      const slugMap = {
        'تویوتا': 'toyota',
        'هیوندای': 'hyundai',
        'نیسان': 'nissan',
        'کیا': 'kia',
        'لکسوس': 'lexus',
        'جیلی': 'geely',
        'مزدا': 'mazda',
        'ام‌جی': 'mg',
        'ام جی': 'mg',
        'میتسوبیشی': 'mitsubishi',
        'فولکس‌واگن': 'volkswagen',
        'فولکس واگن': 'volkswagen',
        'سایپا': 'saipa',
        'سوزوکی': 'suzuki',
        'رنو': 'renault',
        'پژو': 'peugeot',
        'ایران خودرو': 'irankhodro',
        'فاو': 'faw',
        'جی‌ای‌سی': 'jac',
        'جک': 'jac',
        'آلفارومئو': 'alfaromeo',
        'بی‌ام‌دبلیو': 'bmw',
        'مرسدس': 'mercedes',
        'آئودی': 'audi',
        'فولکس': 'volkswagen',
        'هوندا': 'honda',
        'مازراتی': 'maserati',
        'فراری': 'ferrari',
        'لامبورگینی': 'lamborghini',
        'پورشه': 'porsche'
      };
      return slugMap[brandName] || brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    };
    
    // اگر brandId یک نام فارسی است، آن را به slug تبدیل کن
    const brandSlug = typeof brandId === 'string' && /[\u0600-\u06FF]/.test(brandId) 
      ? getBrandSlug(brandId) 
      : brandId;
    
    // Create unique filename with clean brand name
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `brand-${brandSlug}-${Date.now()}.${fileExt}`
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(BRAND_IMAGES_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BRAND_IMAGES_BUCKET)
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Error uploading brand image:', error)
    throw error
  }
}

// Helper function to delete image
export const deleteProductImage = async (imageUrl) => {
  if (!supabase || !imageUrl) return

  try {
    // Extract filename from URL
    const fileName = imageUrl.split('/').pop()
    
    const { error } = await supabase.storage
      .from(PRODUCT_IMAGES_BUCKET)
      .remove([fileName])

    if (error) {
      console.error('Error deleting image:', error)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

// Helper function to delete brand image
export const deleteBrandImage = async (imageUrl) => {
  if (!supabase || !imageUrl) return

  try {
    // Extract filename from URL
    const fileName = imageUrl.split('/').pop()
    
    const { error } = await supabase.storage
      .from(BRAND_IMAGES_BUCKET)
      .remove([fileName])

    if (error) {
      console.error('Error deleting image:', error)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
  }
}

// Function to fetch products with discounts
export const getDiscountedProducts = async (limit = 3) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized')
  }

  try {
    // Fetch products that have originalPrice and price
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .not('originalPrice', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Filter products that have REAL discount (originalPrice > price)
    const productsWithRealDiscount = data.filter(product => {
      if (!product.originalPrice || !product.price) return false;
      
      const originalPrice = parseInt(product.originalPrice.toString().replace(/,/g, ''))
      const currentPrice = parseInt(product.price.toString().replace(/,/g, ''))
      
      // Only include if discount is more than 0%
      return originalPrice > currentPrice;
    }).slice(0, limit); // Take first 'limit' products

    // Calculate discount percentage and format data
    const formattedProducts = productsWithRealDiscount.map(product => {
      const originalPrice = parseInt(product.originalPrice.toString().replace(/,/g, ''))
      const currentPrice = parseInt(product.price.toString().replace(/,/g, ''))
      const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      
      // Get brand image path
      const brandImageMap = {
        'تویوتا': '/WEBP/toyota.webp',
        'هیوندای': '/WEBP/hyun.webp',
        'نیسان': '/WEBP/nissan.webp',
        'کیا': '/WEBP/kia.webp',
        'لکسوس': '/WEBP/lexus.webp',
        'جیلی': '/WEBP/geely.webp',
        'مزدا': '/WEBP/mazda.webp',
        'ام‌جی': '/WEBP/mg.webp',
        'ام جی': '/WEBP/mg.webp',
        'میتسوبیشی': '/WEBP/mitsubishi.webp',
        'فولکس‌واگن': '/WEBP/volkswagen.webp',
        'فولکس واگن': '/WEBP/volkswagen.webp',
        'سایپا': '/WEBP/saipa.webp',
        'سوزوکی': '/WEBP/suzuki.webp',
        'رنو': '/WEBP/renault.webp',
        'پژو': '/WEBP/peugeot.webp',
        'ایران خودرو': '/WEBP/irankhodro.webp',
        'فاو': '/WEBP/faw.webp',
        'جی‌ای‌سی': '/WEBP/jac.webp',
        'جک': '/WEBP/jac.webp',
        'بی‌ام‌دبلیو': '/WEBP/bmw.webp'
      }

      return {
        id: product.id,
        title: product.name,
        subtitle: product.brand,
        discount: `${discountPercent}%`,
        originalPrice: product.originalPrice,
        newPrice: product.price,
        image: brandImageMap[product.brand] || `/WEBP/${product.brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}.webp`,
        bgColor: getRandomGradient(),
        textColor: "text-white",
        targetLink: `/brands/${product.brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        stockStatus: product.stockStatus,
        stockCount: product.stockCount
      }
    })

    return formattedProducts
  } catch (error) {
    console.error('Error fetching discounted products:', error)
    throw error
  }
}

// Helper function to get random gradient colors for cards
const getRandomGradient = () => {
  // رنگ ثابت آبی با گرادیانت
  return "from-blue-600 to-indigo-700"
}

export { supabase }