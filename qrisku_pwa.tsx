import React, { useState, useEffect, useRef } from 'react';
import { 
  QrCode, Home, History, Settings, Bell, CheckCircle2, 
  Clock, XCircle, DollarSign, Wallet, TrendingUp, Receipt, 
  Printer, Share2, Moon, Sun, ArrowUpRight, ShieldCheck, 
  Smartphone, Volume2, VolumeX, RefreshCw, ChevronRight, Download, Menu, X
} from 'lucide-react';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Business Settings State
  const [businessName, setBusinessName] = useState('Kopi Senja Bahagia');
  const [businessLogo, setBusinessLogo] = useState('☕');
  const [bankAccount, setBankAccount] = useState('BCA - 1234567890 a.n. Pemilik Usaha');
  const [qrisStaticData, setQrisStaticData] = useState('00020101021126580016ID.CO.QRIS.WWW0118936009143000000000303UMI51440014ID.JO.QRIS.WWW0215ID102003004050303UMI63041234');

  // Transaction Flow State
  const [inputAmount, setInputAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Umum');
  const [customerName, setCustomerName] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, waiting, success, failed
  const [currentTransaction, setCurrentTransaction] = useState(null);

  // History & Analytics State
  const [transactions, setTransactions] = useState([
    {
      id: 'TRX-98214',
      customer: 'Budi Santoso',
      amount: 45000,
      category: 'Makanan & Minuman',
      time: 'Hari ini, 14:32',
      status: 'success',
      timestamp: Date.now() - 3600000
    },
    {
      id: 'TRX-98213',
      customer: 'Siti Rahma',
      amount: 25000,
      category: 'Minuman',
      time: 'Hari ini, 11:15',
      status: 'success',
      timestamp: Date.now() - 12000000
    },
    {
      id: 'TRX-98210',
      customer: 'Ahmad Fauzi',
      amount: 120000,
      category: 'Paket Keluarga',
      time: 'Kemarin, 19:40',
      status: 'success',
      timestamp: Date.now() - 86400000
    }
  ]);

  // Modal Receipt State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // Audio synthesizer for notification beep
  const playBeep = (type = 'success') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch (e) {
      console.log('Audio context not supported or blocked');
    }
  };

  // Format currency IDR
  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleGenerateQR = (e) => {
    e.preventDefault();
    const cleanAmount = parseInt(inputAmount.replace(/\D/g, ''));
    if (!cleanAmount || cleanAmount <= 0) {
      alert('Masukkan nominal pembayaran yang valid!');
      return;
    }

    const newTxId = 'TRX-' + Math.floor(10000 + Math.random() * 90000);
    const tx = {
      id: newTxId,
      customer: customerName.trim() || 'Pelanggan Umum',
      amount: cleanAmount,
      category: selectedCategory,
      time: 'Baru saja',
      status: 'waiting',
      timestamp: Date.now()
    };

    setCurrentTransaction(tx);
    setPaymentStatus('waiting');
  };

  // Simulate payment callback for testing QRIS Dynamic
  const simulatePaymentResponse = (status) => {
    setPaymentStatus(status);
    if (status === 'success') {
      playBeep('success');
      const updatedTx = { ...currentTransaction, status: 'success', time: 'Baru saja' };
      setTransactions([updatedTx, ...transactions]);
      setReceiptData(updatedTx);
    } else {
      playBeep('error');
      const updatedTx = { ...currentTransaction, status: 'failed', time: 'Baru saja' };
      setTransactions([updatedTx, ...transactions]);
    }
  };

  const resetTransactionForm = () => {
    setInputAmount('');
    setCustomerName('');
    setPaymentStatus('idle');
    setCurrentTransaction(null);
  };

  const todayTransactions = transactions.filter(t => t.status === 'success'); // simplified for demo
  const totalTodayRevenue = todayTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTransactionsCount = todayTransactions.length;

  return (
    <div className={`${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} min-h-screen font-sans transition-colors duration-200`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} px-4 lg:px-8 py-3 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20">
            {businessLogo}
          </div>
          <div>
            <h1 className="font-bold text-base lg:text-lg tracking-tight flex items-center gap-2">
              {businessName} 
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">QRISKu PWA</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Kasir Pintar & QRIS Otomatis</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('home')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'home' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Home size={16} />
            <span>Utama</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <TrendingUp size={16} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <History size={16} />
            <span>Riwayat</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Settings size={16} />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* Quick Utilities */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)} 
            title="Toggle Sound"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            title="Toggle Dark Mode"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* Mobile hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-4 space-y-2 animate-fadeIn`}>
          <button 
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium ${activeTab === 'home' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Home size={18} />
            <span>Halaman Utama</span>
          </button>
          <button 
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium ${activeTab === 'dashboard' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <TrendingUp size={18} />
            <span>Dashboard & Analitik</span>
          </button>
          <button 
            onClick={() => { setActiveTab('history'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium ${activeTab === 'history' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <History size={18} />
            <span>Riwayat Transaksi</span>
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl font-medium ${activeTab === 'settings' ? 'bg-emerald-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings size={18} />
            <span>Pengaturan Usaha</span>
          </button>
        </div>
      )}

      {/* Main Content Body */}
      <main className="max-w-4xl mx-auto p-4 lg:p-6 pb-24">
        
        {/* ================= TAB 1: HOME / KASIR UTAMA ================= */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Banner PWA Install Notice */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Smartphone size={20} className="animate-pulse" />
                  <span className="font-bold text-sm">Pasang QRISKu sebagai Aplikasi HP (PWA)</span>
                </div>
                <p className="text-xs text-emerald-100">Buka menu browser Anda lalu ketuk "Tambahkan ke Layar Utama" (Add to Home Screen) agar dapat digunakan offline seperti aplikasi Android.</p>
              </div>
            </div>

            {/* Main Interactive Box */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6`}>
              
              {/* Form Input Nominal */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col justify-between space-y-6`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <DollarSign className="text-emerald-500" size={20} />
                      <span>Buat Tagihan QRIS</span>
                    </h2>
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">QRIS Otomatis</span>
                  </div>

                  <form onSubmit={handleGenerateQR} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Nominal Pembayaran (Rp)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3.5 font-bold text-slate-400 text-lg">Rp</span>
                        <input 
                          type="text" 
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value.replace(/\D/g, ''))}
                          placeholder="35.000"
                          className={`w-full pl-12 pr-4 py-3 rounded-2xl border text-xl font-bold ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'} outline-none transition-all`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Nama Pelanggan (Opsional)</label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Contoh: Kak Budi"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-emerald-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-500'} outline-none`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Kategori / Produk</label>
                      <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} outline-none`}
                      >
                        <option value="Makanan & Minuman">Makanan & Minuman</option>
                        <option value="Jasa / Layanan">Jasa / Layanan</option>
                        <option value="Retail / Produk">Retail / Produk</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    {/* Quick nominal buttons */}
                    <div className="grid grid-cols-4 gap-2 pt-1">
                      {[10000, 20000, 50000, 100000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setInputAmount(val.toString())}
                          className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'}`}
                        >
                          {val / 1000}rb
                        </button>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <QrCode size={20} />
                      <span>Tampilkan QRIS Dinamis</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* QRIS Display & Status Panel */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center justify-between text-center`}>
                
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{businessName}</span>
                    <span className="text-xs font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      {currentTransaction ? currentTransaction.id : 'Standby'}
                    </span>
                  </div>

                  {/* QRIS Code Box */}
                  <div className={`p-6 rounded-3xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'} my-2 flex flex-col items-center justify-center relative group`}>
                    
                    {/* SVG QR Code Simulation */}
                    <div className="bg-white p-4 rounded-2xl shadow-md">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Decorative QR code blocks */}
                        <div className="absolute inset-2 grid grid-cols-6 gap-1.5 opacity-90">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className={`rounded-sm ${(i % 3 === 0 || i % 5 === 0) ? 'bg-white' : 'bg-emerald-400'}`} />
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 to-teal-500/30 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl shadow-xl border border-white/20">
                            <span className="text-2xl">{businessLogo}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Scan dengan GoPay, OVO, DANA, BCA, ShopeePay, dll</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                        {currentTransaction ? formatIDR(currentTransaction.amount) : 'Rp 0'}
                      </p>
                      {customerName && <p className="text-xs text-emerald-600 font-semibold mt-0.5">Untuk: {customerName}</p>}
                    </div>
                  </div>
                </div>

                {/* Status Pembayaran Badge */}
                <div className="w-full mt-4 space-y-3">
                  <div className={`p-3.5 rounded-2xl border flex items-center justify-center space-x-2 font-semibold text-sm transition-all ${
                    paymentStatus === 'waiting' ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 animate-pulse' :
                    paymentStatus === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400' :
                    paymentStatus === 'failed' ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400' :
                    'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}>
                    {paymentStatus === 'waiting' && <><Clock size={18} className="animate-spin" /><span>🟡 Menunggu Pembayaran...</span></>}
                    {paymentStatus === 'success' && <><CheckCircle2 size={18} /><span>🟢 Pembayaran Berhasil!</span></>}
                    {paymentStatus === 'failed' && <><XCircle size={18} /><span>🔴 Pembayaran Gagal / Dibatalkan</span></>}
                    {paymentStatus === 'idle' && <><ShieldCheck size={18} /><span>Siap Menerima Pembayaran QRIS</span></>}
                  </div>

                  {/* Simulator Testing Buttons for Demo */}
                  {paymentStatus === 'waiting' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => simulatePaymentResponse('success')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all"
                      >
                        Simulasi Berhasil ✅
                      </button>
                      <button 
                        onClick={() => simulatePaymentResponse('failed')}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow transition-all"
                      >
                        Simulasi Gagal ❌
                      </button>
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => { setShowReceiptModal(true); setReceiptData(currentTransaction); }}
                        className="flex-1 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <Receipt size={16} /> Struk
                      </button>
                      <button 
                        onClick={resetTransactionForm}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5"
                      >
                        <RefreshCw size={16} /> Transaksi Baru
                      </button>
                    </div>
                  )}

                  {paymentStatus === 'idle' && (
                    <p className="text-[11px] text-slate-400">Masukkan nominal di samping lalu klik tombol tampilkan untuk membuat tagihan QRIS instan.</p>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 2: DASHBOARD ANALITIK ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Dashboard & Analitik Usaha</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ringkasan performa penjualan harian dan bulanan Anda secara real-time.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center space-x-4`}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xl font-bold">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Total Transaksi Hari Ini</p>
                  <h3 className="text-2xl font-black mt-0.5">{formatIDR(totalTodayRevenue)}</h3>
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block mt-1">+12% dari kemarin</span>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center space-x-4`}>
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-500 flex items-center justify-center text-xl font-bold">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Pemasukan Bulan Ini</p>
                  <h3 className="text-2xl font-black mt-0.5">{formatIDR(totalTodayRevenue + 1450000)}</h3>
                  <span className="text-[10px] text-teal-500 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full inline-block mt-1">Target bulanan 65%</span>
                </div>
              </div>

              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm flex items-center space-x-4`}>
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xl font-bold">
                  <QrCode size={24} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">Jumlah Transaksi Sukses</p>
                  <h3 className="text-2xl font-black mt-0.5">{totalTransactionsCount + 18} <span className="text-sm font-normal text-slate-400">trx</span></h3>
                  <span className="text-[10px] text-indigo-500 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block mt-1">100% QRIS Verified</span>
                </div>
              </div>

            </div>

            {/* Quick Chart Simulation */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-sm mb-4">Grafik Penjualan 7 Hari Terakhir</h3>
              <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2">
                {[40, 65, 30, 85, 95, 75, 90].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-xl transition-all hover:opacity-80" 
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-mono">Day {idx+1}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: RIWAYAT PEMBAYARAN ================= */}
        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Riwayat Pembayaran</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daftar seluruh transaksi QRIS yang masuk.</p>
              </div>
              <button 
                onClick={() => alert('Data riwayat berhasil diexport ke CSV!')}
                className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 px-3 py-2 rounded-xl hover:bg-slate-300 transition-colors"
              >
                Export Laporan
              </button>
            </div>

            <div className={`rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} overflow-hidden shadow-sm`}>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((tx, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {tx.status === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{tx.customer}</h4>
                        <p className="text-xs text-slate-400">{tx.category} • <span className="font-mono text-[11px]">{tx.id}</span></p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm sm:text-base text-slate-900 dark:text-white">{formatIDR(tx.amount)}</p>
                      <p className="text-[11px] text-slate-400">{tx.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PENGATURAN USAHA ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn max-w-2xl mx-auto">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Pengaturan Usaha & QRIS</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Atur profil nama usaha, logo, rekening, dan konfigurasi API gateway.</p>
            </div>

            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-4 shadow-sm`}>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Nama Usaha</label>
                <input 
                  type="text" 
                  value={businessName} 
                  onChange={(e) => setBusinessName(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} outline-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Emoji / Logo Usaha</label>
                <input 
                  type="text" 
                  value={businessLogo} 
                  onChange={(e) => setBusinessLogo(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} outline-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">Rekening Tujuan Pencairan</label>
                <input 
                  type="text" 
                  value={bankAccount} 
                  onChange={(e) => setBankAccount(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} outline-none`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1.5">String QRIS Statis (Payload EMVCo)</label>
                <textarea 
                  rows={3}
                  value={qrisStaticData} 
                  onChange={(e) => setQrisStaticData(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} outline-none`}
                />
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => alert('Pengaturan berhasil disimpan!')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ================= RECEIPT MODAL ================= */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className={`w-full max-w-sm rounded-3xl p-6 ${darkMode ? 'bg-slate-900 text-white border border-slate-800' : 'bg-white text-slate-900'} shadow-2xl relative space-y-4`}>
            
            <div className="text-center border-b pb-4 border-slate-200 dark:border-slate-800">
              <span className="text-3xl">{businessLogo}</span>
              <h3 className="font-bold text-lg mt-1">{businessName}</h3>
              <p className="text-xs text-slate-400">Struk Pembayaran QRIS Resmi</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">ID Transaksi</span>
                <span className="font-mono font-bold">{receiptData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pelanggan</span>
                <span className="font-semibold">{receiptData.customer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Waktu</span>
                <span className="font-medium">{receiptData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-emerald-500 font-bold">LUNAS ✅</span>
              </div>
            </div>

            <div className="border-t border-dashed pt-4 border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-500">Total</span>
              <span className="text-xl font-black text-emerald-500">{formatIDR(receiptData.amount)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button 
                onClick={() => { window.print(); }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer size={16} /> Cetak Struk
              </button>
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Struk ' + businessName, text: `Pembayaran ${formatIDR(receiptData.amount)} LUNAS via QRISKu.` });
                  } else {
                    alert('Struk berhasil disalin ke clipboard!');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 size={16} /> Bagikan
              </button>
            </div>

            <button 
              onClick={() => setShowReceiptModal(false)}
              className="w-full text-xs text-slate-400 hover:text-slate-600 pt-2 text-center font-medium"
            >
              Tutup Struk
            </button>

          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md px-4 py-2 flex justify-around items-center`}>
        <button 
          onClick={() => setActiveTab('home')} 
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${activeTab === 'home' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
        >
          <Home size={20} />
          <span className="text-[10px] mt-1">Utama</span>
        </button>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
        >
          <TrendingUp size={20} />
          <span className="text-[10px] mt-1">Dashboard</span>
        </button>
        <button 
          onClick={() => setActiveTab('history')} 
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${activeTab === 'history' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
        >
          <History size={20} />
          <span className="text-[10px] mt-1">Riwayat</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all ${activeTab === 'settings' ? 'text-emerald-500 font-bold' : 'text-slate-400'}`}
        >
          <Settings size={20} />
          <span className="text-[10px] mt-1">Pengaturan</span>
        </button>
      </nav>

    </div>
  );
}