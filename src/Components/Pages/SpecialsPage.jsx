import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatPriceWithUnit } from '../../lib/utils';

const getBrandSlug = (brandName = '') => {
	const map = {
		'تویوتا': 'toyota',
		'هیوندای': 'hyundai',
		'نیسان': 'nissan',
		'کیا': 'kia',
		'لکسوس': 'lexus',
		'جیلی': 'geely',
		'مزدا': 'mazda',
		'ام جی': 'mg',
		'میتسوبیشی': 'mitsubishi',
		'فولکس واگن': 'volkswagen',
		'سایپا': 'saipa',
		'سوزوکی': 'suzuki',
		'رنو': 'renault',
		'پژو': 'peugeot',
		'ایران خودرو': 'irankhodro',
		'ایران 00خودرو': 'irankhodro',
		'فاو': 'faw',
		'جی 00ای 00سی': 'jac',
		'جک': 'jac'
	};
	return map[brandName] || String(brandName).toLowerCase();
};

const parseNumber = (v) => {
	if (v == null) return null;
	if (typeof v === 'number') return v;
	const s = String(v).replace(/[,\s]/g, '');
	const n = Number(s);
	return Number.isNaN(n) ? null : n;
};

const SpecialsPage = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const pageSize = 20;
	const [searchParams] = useSearchParams();
	const filter = searchParams.get('filter'); // bestseller یا discount

	useEffect(() => {
		const fetchSpecials = async () => {
			try {
				setLoading(true);
				setError(null);
				
				let query = supabase
					.from('products')
					.select('*');
				
				// اگر فیلتر مشخص شده باشد، فقط آن نوع را بگیر
				if (filter === 'bestseller') {
					query = query.eq('badges->>bestseller', 'true');
				} else if (filter === 'discount') {
					// برای تخفیف‌دارها، همه محصولات را بگیریم و فیلتر کنیم
					query = query.or('badges->>discount.eq.true,originalPrice.not.is.null');
				} else {
			// دریافت همه محصولات با نشان‌های مختلف
					query = query.or('badges->>new.eq.true,badges->>bestseller.eq.true,badges->>discount.eq.true');
				}
				
				const { data, error: queryError } = await query.order('updated_at', { ascending: false });
				
				if (queryError) throw queryError;
				
				// فیلتر محصولات
				let filtered = (data || []);
				
				if (filter === 'discount') {
					// فیلتر کردن محصولاتی که واقعاً تخفیف دارند
					filtered = filtered.filter((p) => {
						if (p.badges?.discount === true) return true;
						if (p.originalPrice && p.price) {
							const originalPrice = parseInt(p.originalPrice.toString().replace(/,/g, ''));
							const currentPrice = parseInt(p.price.toString().replace(/,/g, ''));
							if (!isNaN(originalPrice) && !isNaN(currentPrice) && originalPrice > currentPrice) {
								return true;
							}
						}
						return false;
					});
				} else if (filter === 'bestseller') {
					// فقط پرفروش‌ها
					filtered = filtered.filter((p) => p.badges?.bestseller === true);
				} else {
					// همه محصولات با badge
					filtered = filtered.filter((p) => {
					if (p.badges?.new) return true;
					if (p.badges?.bestseller) return true;
					if (p.badges?.discount) return true;
					return false;
				});
				}
				
				console.log('Products with badges:', data);
				console.log('Filtered products:', filtered);
				setProducts(filtered);
			} catch (e) {
				setError(e?.message || 'خطا در دریافت محصولات ویژه');
			} finally {
				setLoading(false);
			}
		};
		fetchSpecials();
	}, [filter]);

	const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
	const start = (page - 1) * pageSize;
	const visibleProducts = products.slice(start, start + pageSize);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-xl">در حال بارگذاری...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-red-600 text-lg">{error}</div>
			</div>
		);
	}

	return (
		<>
			<Helmet>
				<title>تخفیف‌های ویژه و محصولات جدید | لنت شاپ</title>
				<meta name="description" content="محصولات ویژه، جدید و پرفروش لنت شاپ - بهترین تخفیف‌ها و پیشنهادات ویژه روی لنت ترمز خودرو. خرید با قیمت استثنایی و ارسال سریع." />
				<meta name="keywords" content="تخفیف لنت, محصولات جدید, لنت پرفروش, پیشنهادات ویژه, تخفیف لنت ترمز, محصولات ویژه" />
				<meta property="og:title" content="تخفیف‌های ویژه و محصولات جدید | لنت شاپ" />
				<meta property="og:description" content="بهترین تخفیف‌ها و پیشنهادات ویژه روی لنت ترمز خودرو با قیمت استثنایی" />
				<meta property="og:url" content="https://lent-shop.ir/specials" />
				<link rel="canonical" href="https://lent-shop.ir/specials" />
			</Helmet>
			<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<h1 className="text-3xl font-bold text-gray-900 text-center">
						{filter === 'bestseller' ? 'پرفروش‌ترین‌ها' : 
						 filter === 'discount' ? 'تخفیف‌های ویژه' : 
						 'محصولات ویژه و جدید'}
					</h1>
					<p className="text-center text-gray-600 mt-2">
						{filter === 'bestseller' ? 'محصولات محبوب و پرفروش که مشتریان ما بیشتر خریداری کرده‌اند' : 
						 filter === 'discount' ? 'فرصت‌های طلایی خرید با بهترین قیمت‌ها و تخفیف‌های استثنایی' : 
						 'تمام محصولات جدید، پرفروش و تخفیف‌دار'}
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{visibleProducts.length === 0 ? (
					<div className="text-center text-gray-500">هیچ محصول ویژه‌ای یافت نشد</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{visibleProducts.map((product) => (
							<div key={product.id} className="bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-xl shadow-lg overflow-hidden border border-blue-100 flex flex-col">
								<div className="bg-gray-50 flex items-center justify-center relative">
									{product.image ? (
										<img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
									) : (
										<span className="text-gray-400 text-sm">بدون تصویر</span>
									)}
									
									{/* نمایش نشان‌ها */}
									{product.badges && (
										<div className="absolute top-2 right-2 flex flex-col gap-1">
											{product.badges.new && (
												<span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
													جدید
												</span>
											)}
											{product.badges.bestseller && (
												<span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
													پرفروش
												</span>
											)}
											{product.badges.discount && (
												<span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
													تخفیف
												</span>
											)}
										</div>
									)}
								</div>
								<div className="p-4 flex-1 flex flex-col">
									<h3 className="font-bold text-gray-800 mb-2 text-center line-clamp-2">{product.name}</h3>
									<div className="text-center mb-2">
										<span className="text-blue-600 font-bold">{formatPriceWithUnit(product.price)}</span>
										{product.originalPrice && product.originalPrice !== product.price && (
											<span className="text-red-500 line-through text-sm mr-2">{formatPriceWithUnit(product.originalPrice)}</span>
										)}
									</div>
									<Link to={`/product/${getBrandSlug(product.brand)}/${product.id}`} className="mt-auto inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm text-center hover:bg-gray-200 border border-gray-300">مشاهده مشخصات</Link>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Pagination */}
				<div className="flex justify-center items-center gap-2 mt-8">
					<button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-60">قبلی</button>
					<span className="text-sm">صفحه {page} از {totalPages}</span>
					<button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1 rounded bg-gray-200 disabled:opacity-60">بعدی</button>
				</div>
			</div>
		</div>
		</>
	);
};

export default SpecialsPage;
