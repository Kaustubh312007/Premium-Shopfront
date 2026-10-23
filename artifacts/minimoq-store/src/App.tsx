import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight, ChevronDown, CreditCard, Facebook, Headphones, HeartHandshake, Instagram, Leaf, Mail,
  Menu, PackageCheck, Plus, Search, ShieldCheck, ShoppingBag, ShoppingCart,
  Star, Truck, X, Minus, Trash2, Twitter, Pin, UserRound,
} from 'lucide-react';

type Product = {
  id: string; name: string; price: number; originalPrice?: number; rating: string;
  reviews: number; tag?: string; image: string; category: string;
};

const products: Product[] = [
  { id: 'urban-backpack', name: 'Urban Backpack', price: 59, originalPrice: 79, rating: '4.8', reviews: 128, tag: 'Sale', image: '/images/backpack.jpg', category: 'Bags' },
  { id: 'minimal-sneakers', name: 'Minimal White Sneakers', price: 79, rating: '4.7', reviews: 96, image: '/images/sneakers.jpg', category: 'Footwear' },
  { id: 'classic-watch', name: 'Classic Brown Watch', price: 129, rating: '4.9', reviews: 64, tag: 'New', image: '/images/watch.jpg', category: 'Watches' },
  { id: 'polarized-sunglasses', name: 'Polarized Sunglasses', price: 49, rating: '4.6', reviews: 82, image: '/images/sunglasses.jpg', category: 'Accessories' },
  { id: 'hydrating-serum', name: 'Hydrating Face Serum', price: 24, originalPrice: 34, rating: '4.8', reviews: 45, tag: 'Sale', image: '/images/serum.jpg', category: 'Beauty & Care' },
];

const categories = [
  { name: "Men's Fashion", image: '/images/overshirt.jpg', term: 'shirt' },
  { name: "Women's Fashion", image: '/images/handbag.jpg', term: 'bag' },
  { name: 'Footwear', image: '/images/sneakers.jpg', term: 'footwear' },
  { name: 'Watches', image: '/images/watch.jpg', term: 'watch' },
  { name: 'Bags', image: '/images/backpack.jpg', term: 'bag' },
  { name: 'Accessories', image: '/images/sunglasses.jpg', term: 'accessories' },
  { name: 'Home & Living', image: '/images/plant.jpg', term: 'home' },
  { name: 'Beauty & Care', image: '/images/serum.jpg', term: 'beauty' },
];

const collections = ['All Products', 'Best Sellers', 'New Arrivals', 'Sale Items'];
const saleEndAt = new Date('2026-12-31T23:59:59');
type CartLine = { product: Product; quantity: number };

function Brand() {
  return <a href="#top" className="brand" aria-label="Minimoq home">
    <span className="brand-mark"><ShoppingBag size={19} strokeWidth={1.7} /><Leaf size={10} className="brand-leaf" /></span>
    <span><span className="brand-name">minimoq</span><span className="brand-sub">SHOPIFY STORE</span></span>
  </a>;
}

function AnnouncementBar() {
  return <div className="announcement"><div className="container announcement-inner">
    <div className="announcement-item"><Truck size={13} />Free Shipping on Orders Over $50</div>
    <div className="announcement-item"><HeartHandshake size={14} />30-Day Money Back Guarantee</div>
    <div className="announcement-item"><Star size={13} />Excellent 4.9 out of 5</div>
  </div></div>;
}

function App() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuDropdown, setMenuDropdown] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Products');
  const [remaining, setRemaining] = useState(0);
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ message: string; error: boolean } | null>(null);
  const [accountNotice, setAccountNotice] = useState(false);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.floor((saleEndAt.getTime() - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return query ? products.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(query)) : products.slice(0, 3);
  }, [searchTerm]);
  const visibleProducts = useMemo(() => {
    if (activeFilter === 'Sale Items') return products.filter((p) => p.originalPrice);
    if (activeFilter === 'New Arrivals') return products.filter((p) => p.tag === 'New');
    if (activeFilter === 'Best Sellers') return products.slice(0, 3);
    if (activeFilter === 'All Products') return products;
    const term = activeFilter.toLowerCase();
    return products.filter((p) => p.category.toLowerCase().includes(term) || p.name.toLowerCase().includes(term));
  }, [activeFilter]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const found = prev.find((line) => line.product.id === product.id);
      return found
        ? prev.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const changeQuantity = (id: string, change: number) => setCart((prev) => prev
    .map((line) => line.product.id === id ? { ...line, quantity: line.quantity + change } : line)
    .filter((line) => line.quantity > 0));
  const removeLine = (id: string) => setCart((prev) => prev.filter((line) => line.product.id !== id));
  const selectFilter = (filter: string) => {
    setActiveFilter(filter);
    setMenuDropdown(null);
    setMobileOpen(false);
    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
  };
  const submitNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setNewsletterStatus({ message: 'Enter a valid email address to continue.', error: true });
      return;
    }
    setNewsletterStatus({ message: 'Thanks for your interest. This demo does not save email addresses.', error: false });
    setEmail('');
  };
  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return <div id="top">
    <AnnouncementBar />
    <header className="site-header">
      <div className="container header-inner">
        <button className="icon-button mobile-toggle" aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(!mobileOpen)} data-testid="button-mobile-menu">{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <Brand />
        <nav className="nav-links" aria-label="Main navigation">
          <a className="active" href="#top">Home</a>
          <button className="nav-dropdown" aria-expanded={menuDropdown === 'Shop'} onClick={() => setMenuDropdown(menuDropdown === 'Shop' ? null : 'Shop')}>Shop <ChevronDown size={12} /></button>
          <button className="nav-dropdown" aria-expanded={menuDropdown === 'Collections'} onClick={() => setMenuDropdown(menuDropdown === 'Collections' ? null : 'Collections')}>Collections <ChevronDown size={12} /></button>
          <a href="#trending" onClick={() => setActiveFilter('Best Sellers')}>Best Sellers</a>
          <a href="#trending" onClick={() => setActiveFilter('New Arrivals')}>New Arrivals</a>
          <button className="nav-dropdown" aria-expanded={menuDropdown === 'Pages'} onClick={() => setMenuDropdown(menuDropdown === 'Pages' ? null : 'Pages')}>Pages <ChevronDown size={12} /></button>
        </nav>
        <div className="header-actions">
          <button className="icon-button" aria-label="Search products" onClick={() => { setSearchOpen(true); setSearchTerm(''); }} data-testid="button-open-search"><Search size={19} /></button>
          <button className="icon-button account-action" aria-label="Account information" onClick={() => setAccountNotice(true)} data-testid="button-account"><UserRound size={19} /></button>
          <button className="icon-button" aria-label={`Shopping cart, ${cartCount} items`} onClick={() => setCartOpen(true)} data-testid="button-open-cart"><ShoppingCart size={19} />{cartCount > 0 && <span className="cart-count" data-testid="text-cart-count">{cartCount}</span>}</button>
        </div>
        {menuDropdown && <div className="menu-panel desktop-menu" style={{ display: 'block', position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 240, padding: 15, background: 'white', border: '1px solid #eceae6', boxShadow: '0 14px 30px #17251a12', zIndex: 40 }}>
          {(menuDropdown === 'Pages' ? ['About Minimoq', 'Customer care', 'Shipping & returns'] : collections).map((item) => <button key={item} onClick={() => item === 'About Minimoq' ? (setMenuDropdown(null), document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })) : selectFilter(item)} style={{ display: 'block', width: '100%', border: 0, borderBottom: '1px solid #efeee9', background: 'white', textAlign: 'left', padding: '11px 5px', fontSize: 12, color: '#353a35' }}>{item}</button>)}
        </div>}
      </div>
      {mobileOpen && <nav className="menu-panel" aria-label="Mobile navigation">
        <a href="#top" onClick={() => setMobileOpen(false)}>Home <ArrowRight size={14} /></a>
        {collections.map((item) => <a href="#trending" key={item} onClick={() => selectFilter(item)}>{item}<ArrowRight size={14} /></a>)}
        <a href="#categories" onClick={() => setMobileOpen(false)}>Collections<ArrowRight size={14} /></a>
      </nav>}
    </header>
    {accountNotice && <div className="overlay open" role="presentation" onClick={() => setAccountNotice(false)}><div role="dialog" aria-modal="true" aria-labelledby="account-title" style={{ background: 'white', maxWidth: 390, width: 'calc(100% - 36px)', margin: '20vh auto', padding: 28, position: 'relative' }} onClick={(e) => e.stopPropagation()}><button className="drawer-close" style={{ position: 'absolute', right: 18, top: 17 }} aria-label="Close account information" onClick={() => setAccountNotice(false)}><X size={18} /></button><UserRound size={24} color="#286b43" /><h2 id="account-title" style={{ fontFamily: 'Manrope', margin: '14px 0 8px', fontSize: 21 }}>Account access</h2><p style={{ color: '#6c7068', fontSize: 13, lineHeight: 1.7 }}>Account sign-in is not connected in this storefront preview.</p></div></div>}

    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <div className="eyebrow">New collection</div>
            <h1>Elevate Your Lifestyle with <em>Premium Products</em></h1>
            <p>Discover carefully curated products designed for quality, style, and everyday comfort.</p>
            <div className="hero-ctas"><a className="button button-primary" href="#trending">Shop Now <ArrowRight size={15} /></a><a className="button button-outline" href="#categories">Explore Collections</a></div>
            <div className="hero-benefits">
              <div className="benefit"><span className="benefit-icon"><Truck size={15} /></span><div><strong>Free Shipping</strong><span>On orders over $50</span></div></div>
              <div className="benefit"><span className="benefit-icon"><PackageCheck size={15} /></span><div><strong>Easy Returns</strong><span>30-day return policy</span></div></div>
              <div className="benefit"><span className="benefit-icon"><ShieldCheck size={15} /></span><div><strong>Secure Payment</strong><span>Secure checkout experience</span></div></div>
              <div className="benefit"><span className="benefit-icon"><Headphones size={15} /></span><div><strong>Here to Help</strong><span>Dedicated customer care</span></div></div>
            </div>
          </div>
          <div className="hero-visual"><img className="hero-photo" src="/images/hero-edit.jpg" alt="A considered still life of travel, apparel and everyday essentials" /><div className="discount-burst"><b>30%</b><span>up to off</span></div></div>
        </div>
      </section>

      <section className="category-section" id="categories">
        <div className="container">
          <div className="section-heading"><div><h2>Shop by Category</h2><p>Good things for every part of your day.</p></div><a className="text-link" href="#trending" onClick={() => setActiveFilter('All Products')}>View all collections <ArrowRight size={14} /></a></div>
          <div className="category-grid">{categories.map((category) => <a key={category.name} className="category-card" href="#trending" onClick={() => selectFilter(category.name)} data-testid={`link-category-${category.name.toLowerCase().replaceAll(/[^a-z]+/g, '-')}`}><div className="category-image"><img src={category.image} alt="" loading="lazy" /></div><span>{category.name}</span></a>)}</div>
        </div>
      </section>

      <section className="sale-section" aria-labelledby="sale-title">
        <div className="container">
          <div className="sale-panel">
            <div className="sale-copy"><div className="eyebrow">Limited time offer</div><h2 id="sale-title">Spring Sale<br />Is Live!</h2><p>Get up to 30% off on selected items.</p><a className="button button-primary" href="#trending" onClick={() => setActiveFilter('Sale Items')}>Shop the Sale <ArrowRight size={14} /></a></div>
            <div className="countdown-card"><p>{remaining > 0 ? 'Hurry up! Offer ends in' : 'This offer has ended'}</p><div className="timer" aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds remaining`} aria-live="off">
              {[['Days', days], ['Hours', hours], ['Minutes', minutes], ['Seconds', seconds]].map(([label, value], index) => <span className="timer-cell" key={label}><strong>{String(value).padStart(2, '0')}</strong><span>{label}</span></span>).reduce<ReactNode[]>((acc, item, index) => { if (index) acc.push(<span className="timer-colon" key={`colon-${index}`}>:</span>); acc.push(item); return acc; }, [])}
            </div><span className="small-note">A little time to find your next favorite.</span></div>
            <div className="sale-images"><img src="/images/sale-still.jpg" alt="Ivory sneakers and folded soft knitwear" loading="lazy" /><img src="/images/sale-model.jpg" alt="Relaxed neutral fashion in afternoon light" loading="lazy" /></div>
          </div>
        </div>
      </section>

      <section className="trending-section" id="trending">
        <div className="container">
          <div className="section-heading"><div><h2>{activeFilter === 'All Products' ? 'Trending Products' : activeFilter}</h2><p>Everyday pieces, chosen to be kept.</p></div><a className="text-link" href="#trending" onClick={() => setActiveFilter('All Products')}>View all products <ArrowRight size={14} /></a></div>
          <div className="product-grid">
            {visibleProducts.length ? visibleProducts.map((product) => <article className="product-card" key={product.id} data-testid={`card-product-${product.id}`}>
              <div className="product-photo"><img src={product.image} alt={product.name} loading="lazy" />{product.tag && <span className="product-tag">{product.tag}</span>}<button className="add-cart" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)} data-testid={`button-add-${product.id}`}><Plus size={18} /></button></div>
              <div className="product-info"><h3 className="product-name">{product.name}</h3><div className="product-price"><span>${product.price.toFixed(2)}</span>{product.originalPrice && <span className="old-price">${product.originalPrice.toFixed(2)}</span>}</div><div className="product-rating"><span className="stars" aria-label={`${product.rating} out of 5 stars`}>★★★★★</span><span>{product.rating} ({product.reviews})</span></div></div>
            </article>) : <div className="search-empty" style={{ gridColumn: '1 / -1', padding: '40px 0' }}>Nothing in this collection just yet. <button className="text-link" onClick={() => setActiveFilter('All Products')}>Browse all products</button></div>}
          </div>
        </div>
      </section>

      <section className="trust-section" aria-label="Shop with confidence">
        <div className="container trust-grid">
          <div className="trust-item"><span className="trust-icon"><Star size={22} strokeWidth={1.5} /></span><div><strong>4.9/5 Average Rating</strong><span>From 10,000+ Reviews</span></div></div>
          <div className="trust-item"><span className="trust-icon"><Truck size={22} strokeWidth={1.5} /></span><div><strong>Fast & Free Shipping</strong><span>On orders over $50</span></div></div>
          <div className="trust-item"><span className="trust-icon"><HeartHandshake size={22} strokeWidth={1.5} /></span><div><strong>30-Day Money Back</strong><span>No questions asked</span></div></div>
          <div className="trust-item"><span className="trust-icon"><ShieldCheck size={22} strokeWidth={1.5} /></span><div><strong>Secure & Safe Checkout</strong><span>Your data is protected</span></div></div>
        </div>
      </section>

      <section className="newsletter">
        <div className="container newsletter-inner">
          <div className="newsletter-title"><span className="newsletter-icon"><Mail size={20} strokeWidth={1.5} /></span><div><h2>A little good in your inbox.</h2><p>New finds, thoughtful edits, and occasional offers.</p></div></div>
          <form className="newsletter-form" onSubmit={submitNewsletter} noValidate><label className="small-note" htmlFor="newsletter-email">Email address</label><div className="newsletter-controls"><input id="newsletter-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setNewsletterStatus(null); }} placeholder="Enter your email" autoComplete="email" aria-describedby="newsletter-message" data-testid="input-newsletter-email" /><button type="submit" data-testid="button-newsletter-subscribe">Subscribe</button></div><p id="newsletter-message" className={`newsletter-message ${newsletterStatus?.error ? 'error' : ''}`} role="status">{newsletterStatus?.message ?? 'This demo will not store or send your email.'}</p></form>
        </div>
      </section>
    </main>

    <footer className="footer" id="footer">
      <div className="container footer-main">
        <div className="footer-brand"><Brand /><p>Quality products, unmatched style, and exceptional customer service. That's our promise to you.</p><div className="socials"><a className="social-link" href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={14} /></a><a className="social-link" href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={14} /></a><a className="social-link" href="https://x.com/" aria-label="X"><Twitter size={14} /></a><a className="social-link" href="https://www.pinterest.com/" aria-label="Pinterest"><Pin size={14} /></a></div></div>
        <FooterColumn title="Shop" links={['All Products', 'Best Sellers', 'New Arrivals', 'Sale Items', 'Gift Cards']} onSelect={selectFilter} />
        <FooterColumn title="Collections" links={["Men's Fashion", "Women's Fashion", 'Footwear', 'Accessories', 'Home & Living']} onSelect={selectFilter} />
        <FooterColumn title="Customer Service" links={['Contact Us', 'FAQs', 'Shipping Policy', 'Return Policy', 'Track Your Order']} onSelect={() => setAccountNotice(true)} />
        <FooterColumn title="Company" links={['About Us', 'Our Blog', 'Careers', 'Privacy Policy', 'Terms of Service']} onSelect={() => setAccountNotice(true)} />
        <div className="footer-column"><h3>Payment Methods</h3><div className="payments" aria-label="Accepted payment methods"><span className="payment-mark">VISA</span><span className="payment-mark">MC</span><span className="payment-mark">AMEX</span><span className="payment-mark">PayPal</span><span className="payment-mark">Apple Pay</span><span className="payment-mark">Shop Pay</span></div><p className="small-note" style={{ lineHeight: 1.7, marginTop: 13 }}>Payment options are shown for display only. No checkout is available in this preview.</p></div>
      </div>
      <div className="container footer-bottom"><span>© 2024 Minimoq Shopify Store. All Rights Reserved.</span><div className="locale-selectors"><button aria-label="Country, United States"><span>United States</span><ChevronDown size={12} /></button><button aria-label="Currency, US dollars">USD $ <ChevronDown size={12} /></button></div></div>
    </footer>

    <div className={`overlay ${cartOpen ? 'open' : ''}`} onClick={() => setCartOpen(false)} aria-hidden="true" />
    <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping cart" aria-hidden={!cartOpen}>
      <div className="drawer-head"><h2>Your bag <span style={{ color: '#73756f', fontSize: 13 }}>({cartCount})</span></h2><button className="drawer-close" aria-label="Close cart" onClick={() => setCartOpen(false)} data-testid="button-close-cart"><X size={20} /></button></div>
      <div className="drawer-items">{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={28} strokeWidth={1.4} /><strong>Your bag is taking a breather.</strong><p>There’s plenty to find when you’re ready.</p><button className="button button-primary" onClick={() => { setCartOpen(false); document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' }); }}>Discover the edit <ArrowRight size={14} /></button></div> : cart.map(({ product, quantity }) => <div className="cart-row" key={product.id}><img src={product.image} alt="" /><div><h3>{product.name}</h3><p>${product.price.toFixed(2)}</p><div className="quantity-control" aria-label={`Quantity for ${product.name}`}><button aria-label={`Decrease quantity of ${product.name}`} onClick={() => changeQuantity(product.id, -1)}><Minus size={12} /></button><span>{quantity}</span><button aria-label={`Increase quantity of ${product.name}`} onClick={() => changeQuantity(product.id, 1)}><Plus size={12} /></button></div></div><button className="remove-item" aria-label={`Remove ${product.name}`} onClick={() => removeLine(product.id)}><Trash2 size={15} /></button></div>)}</div>
      {cart.length > 0 && <div className="drawer-foot"><div className="subtotal-line"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><p className="drawer-note">Shipping and taxes are shown for reference only. Checkout is not available in this preview.</p><div className="checkout-note"><CreditCard size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />No payment or order will be processed.</div></div>}
    </aside>

    <div className={`search-panel ${searchOpen ? 'open' : ''}`} aria-hidden={!searchOpen}>
      <div className="container"><div className="search-bar"><Search size={19} /><input autoFocus={searchOpen} type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search considered essentials…" aria-label="Search products" data-testid="input-product-search" /><button className="drawer-close" aria-label="Close search" onClick={() => setSearchOpen(false)}><X size={19} /></button></div>
        {searchResults.length ? <div className="search-results">{searchResults.map((product) => <button className="search-result" key={product.id} onClick={() => { setSearchOpen(false); document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' }); setActiveFilter('All Products'); }}><img src={product.image} alt="" /><span>{product.name}<span style={{ display: 'block', color: '#777972', marginTop: 4 }}>${product.price.toFixed(2)}</span></span></button>)}</div> : <p className="search-empty">No products found for “{searchTerm}”. Try another search.</p>}
      </div>
    </div>
  </div>;
}

function FooterColumn({ title, links, onSelect }: { title: string; links: string[]; onSelect: (link: string) => void }) {
  return <div className="footer-column"><h3>{title}</h3><ul>{links.map((link) => <li key={link}><a href={title === 'Collections' ? '#trending' : '#trending'} onClick={() => onSelect(link)}>{link}</a></li>)}</ul></div>;
}

export default App;
