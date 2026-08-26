'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BetaDisclaimerBanner from '@/components/BetaDisclaimerBanner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Minus,
  X,
  Star,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  ShoppingBasket,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/ui/custom-select';

interface Product {
  id: string;
  name: string;
  subCategory: 'dry' | 'wet' | 'prescription' | 'treats';
  subCategoryLabel: string;
  price: number;
  rating: number;
  reviews: number;
  species: 'dog' | 'cat' | 'exotic';
  speciesLabel: string;
  description: string;
  specs: Record<string, string>;
  inclusions: string[];
  inStock: boolean;
  image: string;
  badge?: string;
}

const foodProducts: Product[] = [
  {
    id: 'food-orijen-fish',
    name: 'Orijen Six Fish Adult Dry Dog Food',
    subCategory: 'dry',
    subCategoryLabel: 'High-Protein Kibble',
    price: 6500,
    rating: 4.9,
    reviews: 148,
    species: 'dog',
    speciesLabel: 'Dogs',
    description: 'Biologically appropriate grain-free food made with six wild-caught regional fish including herring, mackerel, flounder, and hake.',
    specs: { Weight: '11.4 kg', Lifestage: 'Adult', Formulation: 'Grain-Free / High-Protein' },
    inclusions: ['85% quality fish ingredients', 'Cold-freeze coated kibbles', 'Natural omega fatty acids'],
    inStock: true,
    badge: 'Premium Choice',
    image: '/products/dog_food_bag.png'
  },
  {
    id: 'food-rc-cat-gi',
    name: 'Royal Canin GI Vet Diet Dry Cat Food',
    subCategory: 'prescription',
    subCategoryLabel: 'Veterinary Exclusive',
    price: 2200,
    rating: 4.8,
    reviews: 92,
    species: 'cat',
    speciesLabel: 'Cats',
    description: 'Veterinary exclusive formulation designed to support optimal gastrointestinal health, digestion, and acute intestinal absorption disorders in cats.',
    specs: { Weight: '2.0 kg', Lifestage: 'Adult / Senior', Prescription: 'Required / Vet Approved' },
    inclusions: ['Highly digestible proteins', 'Prebiotics for healthy flora', 'High energy density formula'],
    inStock: true,
    badge: 'Prescription',
    image: '/products/dog_food_bag.png'
  },
  {
    id: 'food-acana-prairie',
    name: 'Acana Wild Prairie Cat & Kitten Dry Food',
    subCategory: 'dry',
    subCategoryLabel: 'All-Stage Dry Food',
    price: 3100,
    rating: 4.7,
    reviews: 64,
    species: 'cat',
    speciesLabel: 'Cats / Kittens',
    description: 'Grain-free food rich in free-run chicken, turkey, wild-caught fish, and cage-free eggs. Delivers complete nourishment for all life stages.',
    specs: { Weight: '1.8 kg', Lifestage: 'All Life Stages', Formulation: 'Grain-Free' },
    inclusions: ['75% animal ingredients', 'Essential taurine & vitamins', 'Fruit & botanicals infused'],
    inStock: true,
    image: '/products/dog_food_bag.png'
  },
  {
    id: 'food-zupreem-avian',
    name: 'ZuPreem FruitBlend Medium Avian Pellets',
    subCategory: 'dry',
    subCategoryLabel: 'Avian Daily Diet',
    price: 1800,
    rating: 4.6,
    reviews: 41,
    species: 'exotic',
    speciesLabel: 'Birds / Parrots',
    description: 'FruitBlend pellets with natural flavors provide healthy and balanced daily nutrition for Cockatiels, Lovebirds, and other medium parrots.',
    specs: { Weight: '1.6 kg', Species: 'Medium Birds', Flavor: 'Natural Fruits' },
    inclusions: ['Formulated by avian veterinarians', '21 essential vitamins & minerals', 'Highly palatable fruit shapes'],
    inStock: true,
    image: '/products/dog_food_bag.png'
  },
  {
    id: 'food-taste-wild',
    name: 'Taste of the Wild High Prairie Canine',
    subCategory: 'dry',
    subCategoryLabel: 'High-Protein Kibble',
    price: 5405,
    rating: 4.8,
    reviews: 189,
    species: 'dog',
    speciesLabel: 'Dogs',
    description: 'Formulated with real roasted bison and venison, grain-free carbohydrate sources, and healthy fruits/vegetables for robust energy.',
    specs: { Weight: '12.2 kg', Lifestage: 'Adult', Formulation: 'Grain-Free' },
    inclusions: ['Roasted bison & venison', 'Species-specific probiotics', 'Antioxidants for immunity support'],
    inStock: true,
    image: '/products/dog_food_bag.png'
  },
  {
    id: 'food-treats-jerk',
    name: 'Bark Out Loud Organic Chicken Jerky',
    subCategory: 'treats',
    subCategoryLabel: 'Healthy Treats',
    price: 499,
    rating: 4.7,
    reviews: 80,
    species: 'dog',
    speciesLabel: 'Dogs',
    description: '100% organic, single-source chicken jerky strips slow-dehydrated to preserve vital nutrients and savory natural flavors.',
    specs: { Weight: '150 g', Type: 'Dehydrated Treats', Organic: 'Yes' },
    inclusions: ['No added sugars or preservatives', 'Single-ingredient source', 'High in digestible lean proteins'],
    inStock: true,
    image: '/products/pet_treats_pack.png'
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function PetFoodShop() {
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedSubCats, setSelectedSubCats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Cart & checkout
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleToggleSpecies = (spec: string) => {
    setSelectedSpecies(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleToggleSubCat = (cat: string) => {
    setSelectedSubCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSelectedSpecies([]);
    setSelectedSubCats([]);
    setPriceRange({ min: '', max: '' });
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery('');
    setSortBy('featured');
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => prev.map((item) => {
      if (item.product.id === productId) {
        const next = item.quantity + delta;
        return next <= 0 ? null : { ...item, quantity: next };
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const subtotal = cart.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const gstTax = Math.round(subtotal * 0.05);
  const shippingCost = subtotal > 1000 || subtotal === 0 ? 0 : 120;
  const grandTotal = subtotal + gstTax + shippingCost;

  const handleExecuteCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsCheckoutSuccess(true);
      setCart([]);
    }, 1500);
  };

  const filteredProducts = foodProducts.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecies = selectedSpecies.length === 0 ? true : selectedSpecies.includes(prod.species);
    const matchesSubCat = selectedSubCats.length === 0 ? true : selectedSubCats.includes(prod.subCategory);
    const minVal = priceRange.min === '' ? 0 : Number(priceRange.min);
    const maxVal = priceRange.max === '' ? Infinity : Number(priceRange.max);
    const matchesPrice = prod.price >= minVal && prod.price <= maxVal;
    const matchesRating = prod.rating >= minRating;
    const matchesStock = inStockOnly ? prod.inStock : true;
    return matchesSearch && matchesSpecies && matchesSubCat && matchesPrice && matchesRating && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating-desc') return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background overflow-hidden relative font-sans">
      {/* Ghost Light Background Patterns - Matches Consultation / Vets Pages */}
      <div className="fixed inset-0 bg-[image:var(--bg-subtle-mesh)] pointer-events-none opacity-90 z-0" />
      <div className="fixed inset-0 bg-[image:var(--bg-dot-pattern)] bg-[length:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] z-0" />
      <div className="fixed inset-0 bg-slate-50/40 dark:bg-transparent pointer-events-none z-0" />

      <div className="relative z-10">
        <Header />

        {/* TOP SEARCH BAR PANEL */}
        <section className="pt-24 md:pt-32 pb-4">
          <div className="container mx-auto px-8 lg:px-20">
            <div className="max-w-6xl mx-auto">
              {/* Early Access Banner */}
              <BetaDisclaimerBanner category="feed and nutrition store" />

              {/* Redesigned Search and Filter Controls */}
              <div className="flex items-center gap-3 mb-6 mt-4">
                {/* Search Input - Matching find-vets style with full glass border */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search premium food, kibbles, treats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-11 text-sm border-border bg-background rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 w-full"
                  />
                </div>

                {/* Sort Dropdown using standard CustomSelect to match care pages */}
                <div className="w-56 shrink-0 z-20">
                  <CustomSelect
                    options={[
                      { value: 'featured', label: 'Sort: Featured' },
                      { value: 'price-asc', label: 'Sort: Price: Low to High' },
                      { value: 'price-desc', label: 'Sort: Price: High to Low' },
                      { value: 'rating-desc', label: 'Sort: Avg. Rating' }
                    ]}
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    placeholder="Sort products"
                    className="h-11 rounded-xl border-border bg-background shadow-sm hover:bg-accent text-sm"
                  />
                </div>

                {/* Cart Control Panel */}
                <Button
                  onClick={() => setIsCartOpen(true)}
                  className="h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-extrabold text-sm shadow-sm flex items-center gap-2 relative transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Cart</span>
                  {cart.length > 0 && (
                    <span className="w-5 h-5 bg-white text-primary font-black rounded-full flex items-center justify-center text-[10px] absolute -top-1.5 -right-1.5 border border-primary/50 shadow-md">
                      {cart.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2-COLUMN RETAIL EXPERIENCE */}
        <main className="container mx-auto px-8 lg:px-20 py-2 pb-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-8">
            
            {/* COLUMN 1: SIDEBAR FILTERS (col-span-3) */}
            <div className="lg:col-span-3 space-y-6 hidden lg:block">
              <div className="glass-card shadow-card rounded-2xl p-5 space-y-6 bg-card/60 dark:bg-card/30 backdrop-blur-md border border-border/80">
                
                <div className="flex items-center justify-between border-b border-border/80 pb-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <span>Refine Food</span>
                  </div>
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                </div>

                {/* 1. Species Checkboxes */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">Pet Species</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'dog', label: 'Dogs' },
                      { key: 'cat', label: 'Cats' },
                      { key: 'exotic', label: 'Birds & Exotics' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSpecies.includes(item.key)}
                          onChange={() => handleToggleSpecies(item.key)}
                          className="rounded border-input text-primary focus:ring-primary w-4 h-4 bg-background"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Sub-Category Checkboxes */}
                <div className="space-y-3 border-t border-border/80 pt-4">
                  <h4 className="text-sm font-semibold text-foreground">Food Type</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'dry', label: 'High-Protein Kibble' },
                      { key: 'prescription', label: 'Veterinary Prescriptions' },
                      { key: 'treats', label: 'Healthy Organic Treats' }
                    ].map((item) => (
                      <label key={item.key} className="flex items-center gap-2.5 text-sm text-muted-foreground font-medium cursor-pointer hover:text-foreground transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSubCats.includes(item.key)}
                          onChange={() => handleToggleSubCat(item.key)}
                          className="rounded border-input text-primary focus:ring-primary w-4 h-4 bg-background"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Price Preset & Inputs */}
                <div className="space-y-3 border-t border-border/80 pt-4">
                  <h4 className="text-sm font-semibold text-foreground">Price</h4>
                  
                  <div className="space-y-2 text-sm text-muted-foreground font-medium">
                    <button onClick={() => setPriceRange({ min: '0', max: '1000' })} className="block hover:text-primary transition-colors text-left">Under ₹1,000</button>
                    <button onClick={() => setPriceRange({ min: '1000', max: '3000' })} className="block hover:text-primary transition-colors text-left">₹1,000 - ₹3,000</button>
                    <button onClick={() => setPriceRange({ min: '3000', max: '' })} className="block hover:text-primary transition-colors text-left">Over ₹3,000</button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="h-8 text-xs border-border bg-background focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                    <span className="text-muted-foreground text-xs">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="h-8 text-xs border-border bg-background focus-visible:ring-primary focus-visible:ring-offset-0"
                    />
                  </div>
                </div>

                {/* 4. Rating Stars */}
                <div className="space-y-3 border-t border-border/80 pt-4">
                  <h4 className="text-sm font-semibold text-foreground">Avg. Customer Review</h4>
                  <div className="space-y-2 text-sm font-medium">
                    {[4, 3, 2].map((stars) => (
                      <button
                        key={stars}
                        onClick={() => setMinRating(stars)}
                        className={`flex items-center gap-1.5 hover:text-primary transition-colors text-left ${minRating === stars ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                      >
                        <div className="flex gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star 
                              key={idx} 
                              className={`w-4 h-4 ${idx < stars ? 'fill-amber-500 text-amber-500' : 'text-border dark:text-muted'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Out of Stock Toggle */}
                <div className="border-t border-border/80 pt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Exclude Out of Stock</span>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-input text-primary focus:ring-primary w-4 h-4 cursor-pointer bg-background"
                  />
                </div>

              </div>
            </div>

            {/* COLUMN 2: PRODUCT CATALOG (col-span-9) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Product Cards Grid */}
              {sortedProducts.length === 0 ? (
                <div className="glass-card shadow-card p-16 text-center rounded-2xl bg-card/60 dark:bg-card/30 border border-border/80 space-y-4">
                  <ShoppingBasket className="w-12 h-12 text-muted-foreground mx-auto opacity-70 animate-bounce" />
                  <h3 className="text-lg font-semibold text-foreground">No food products match your active filters</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
                  <Button 
                    onClick={clearAllFilters}
                    className="h-10 px-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-xs"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((prod) => (
                    <Card
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="group bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden cursor-pointer flex flex-col"
                    >
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Visual Thumbnail with High-Quality Generated Image */}
                        <div className="w-full aspect-square bg-muted/30 border-b border-border/50 flex items-center justify-center relative overflow-hidden">
                          {prod.badge && (
                            <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-bold tracking-wider uppercase">
                              {prod.badge}
                            </span>
                          )}
                          
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          <span className="absolute bottom-3 right-3 z-10 px-2.5 py-0.5 rounded-md bg-background/90 dark:bg-background/80 border border-border text-[9px] font-bold text-muted-foreground">
                            {prod.speciesLabel}
                          </span>
                        </div>

                        {/* Card Details */}
                        <div className="p-4 flex flex-col flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{prod.subCategoryLabel}</span>
                            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold font-sans">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>{prod.rating}</span>
                            </div>
                          </div>

                          {/* Name */}
                          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1.5">
                            {prod.name}
                          </h3>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4 flex-1">
                            {prod.description}
                          </p>

                          {/* Price & Action */}
                          <div className="flex justify-between items-center border-t border-border/50 pt-3 mt-auto">
                            <div className="text-base font-bold text-foreground">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </div>
                            
                            <Button
                              onClick={(e) => handleAddToCart(prod, e)}
                              className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/95 text-white text-[11px] font-bold transition-all shadow-sm"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

            </div>

          </div>
        </main>

        {/* SHOPPING CART DRAWER */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-[100] flex justify-end">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="w-full max-w-md bg-background h-full relative z-10 shadow-2xl flex flex-col border-l border-border"
              >
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-foreground text-lg">Your Feed Cart</h3>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                      <ShoppingBasket className="w-10 h-10 text-muted-foreground opacity-50" />
                      <h4 className="font-bold text-muted-foreground text-xs">No food items added yet</h4>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-muted/20">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">{item.product.name}</h4>
                          <div className="text-[10px] text-muted-foreground font-semibold">{item.product.subCategoryLabel}</div>
                          <div className="text-xs font-black text-foreground mt-0.5 font-sans">₹{item.product.price}</div>
                        </div>
                        <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-1">
                          <button onClick={() => handleUpdateQuantity(item.product.id, -1)} className="w-4 h-4 hover:bg-accent flex items-center justify-center"><Minus className="w-2.5 h-2.5 text-muted-foreground" /></button>
                          <span className="text-[10px] font-black w-3 text-center text-foreground font-sans">{item.quantity}</span>
                          <button onClick={() => handleUpdateQuantity(item.product.id, 1)} className="w-4 h-4 hover:bg-accent flex items-center justify-center"><Plus className="w-2.5 h-2.5 text-muted-foreground" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="p-6 border-t border-border bg-muted/10 space-y-4">
                    <div className="space-y-2 text-xs font-semibold text-muted-foreground font-sans">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="text-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%)</span>
                        <span className="text-foreground">₹{gstTax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-foreground">{shippingCost === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${shippingCost}`}</span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between text-sm font-black text-foreground">
                        <span>Total</span>
                        <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleExecuteCheckout}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-extrabold flex items-center justify-center gap-2"
                    >
                      Checkout Feed Order <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CHECKOUT SUCCESS MODAL */}
        <AnimatePresence>
          {isCheckoutSuccess && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutSuccess(false)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-background rounded-2xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 relative z-10 shadow-2xl border border-border">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 rounded-full flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground">Feed Order Confirmed!</h3>
                  <p className="text-xs text-muted-foreground">
                    Your pet's nutrition packet has been booked. It will be dispatched from our nearest animal feed depot shortly.
                  </p>
                </div>
                <Button onClick={() => setIsCheckoutSuccess(false)} className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs">
                  Continue Shopping
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* DETAILED SPEC MODAL */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)} className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" />
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-background rounded-2xl max-w-lg w-full p-6 relative z-10 shadow-2xl space-y-5 border border-border">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-12 h-12 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{selectedProduct.subCategoryLabel}</span>
                      <h4 className="font-bold text-foreground text-base leading-tight mt-0.5">{selectedProduct.name}</h4>
                    </div>
                  </div>
                  <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground text-sm">✕</button>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

                <div className="grid grid-cols-2 gap-3 bg-muted/20 p-4 rounded-xl border border-border/80 text-xs font-semibold text-muted-foreground">
                  {Object.entries(selectedProduct.specs).map(([k, v]) => (
                    <div key={k}>{k}: <span className="text-foreground font-bold">{v}</span></div>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Nutrition & Features</div>
                  <div className="grid sm:grid-cols-2 gap-2 text-xs text-foreground">
                    {selectedProduct.inclusions.map((feature) => (
                      <div key={feature} className="flex items-start gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <div className="text-xl font-bold text-foreground font-sans">₹{selectedProduct.price.toLocaleString('en-IN')}</div>
                  <div className="flex gap-2">
                    <Button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); }} className="h-10 px-4 rounded-lg border border-border hover:bg-accent text-foreground text-xs font-bold bg-background">Add to Cart</Button>
                    <Button onClick={() => { handleAddToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true); }} className="h-10 px-4 rounded-lg bg-primary text-white text-xs font-bold">Buy Now</Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Cart Loader */}
        <AnimatePresence>
          {isCheckingOut && (
            <div className="fixed inset-0 z-[200] bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
              <div className="bg-background p-5 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-bold text-foreground border border-border">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Securing feed checkout session...
              </div>
            </div>
          )}
        </AnimatePresence>

        <Footer />
      </div>
    </div>
  );
}
