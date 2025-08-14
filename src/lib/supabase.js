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

export { supabase }