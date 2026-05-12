import { useState, useEffect, useRef } from 'react';
import { database } from './lib/firebase';
import { ref, onValue, set, off, get } from 'firebase/database';
import { Chatbot } from './components/Chatbot';
import { LiveComment } from './components/LiveComment';
import { 
  Trash2, 
  Settings, 
  Plus, 
  Menu, 
  X, 
  Edit2, 
  Save, 
  RefreshCw,
  CheckCircle2,
  Trash,
  BarChart2,
  Wifi,
  Activity,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [dipantau, setDipantau] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('savedTrashCans');
    if (!saved) return {};
    try {
      const parsed = JSON.parse(saved);
      for (let key in parsed) {
        if (parsed[key] === true) {
          parsed[key] = key;
        }
      }
      return parsed;
    } catch (e) {
      return {};
    }
  });

  const [realtimeData, setRealtimeData] = useState<Record<string, number>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [inputId, setInputId] = useState('');
  const [configId, setConfigId] = useState('');
  const [tinggiTong, setTinggiTong] = useState<string>('');
  const [jarakPenuh, setJarakPenuh] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [msgGlobal, setMsgGlobal] = useState('Masukkan kode tong sampah untuk memulai pemantauan.');

  // Modal states
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameInput, setRenameInput] = useState<string>('');

  // Sync localStorage
  useEffect(() => {
    localStorage.setItem('savedTrashCans', JSON.stringify(dipantau));
    const count = Object.keys(dipantau).length;
    setMsgGlobal(count > 0 ? `Memantau ${count} perangkat.` : 'Masukkan kode tong sampah untuk memulai pemantauan.');
  }, [dipantau]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Setup Firebase Listeners
  useEffect(() => {
    const refs: Record<string, any> = {};
    
    Object.keys(dipantau).forEach(id => {
      const dbRef = ref(database, `Monitoring/${id}`);
      refs[id] = dbRef;
      
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRealtimeData(prev => ({ ...prev, [id]: data.kepenuhan }));
        }
      });
    });

    return () => {
      Object.values(refs).forEach(dbRef => off(dbRef));
    };
  }, [dipantau]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const tambahPerangkat = async () => {
    const id = inputId.trim();
    if (!id) return;
    if (dipantau[id]) {
      alert("Tong sudah ada di daftar!");
      return;
    }

    try {
      const snapshot = await get(ref(database, `Monitoring/${id}`));
      if (snapshot.exists()) {
        setDipantau(prev => ({ ...prev, [id]: id }));
        setInputId('');
        setConfigId(id);
        if (isMobile) setSidebarOpen(false);
      } else {
        alert(`⚠️ Tong dengan kode '${id}' tidak ditemukan di database!`);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memeriksa database.");
    }
  };

  const confirmHapus = () => {
    if (deleteId) {
      setDipantau(prev => {
        const next = { ...prev };
        delete next[deleteId];
        return next;
      });
      setRealtimeData(prev => {
        const next = { ...prev };
        delete next[deleteId];
        return next;
      });
      if (configId === deleteId) setConfigId('');
      setDeleteId(null);
    }
  };

  const hapusPerangkat = (id: string) => {
    setDeleteId(id);
  };

  const confirmUbahNama = () => {
    if (renameId && renameInput.trim() !== "") {
      setDipantau(prev => ({ ...prev, [renameId]: renameInput.trim() }));
      setRenameId(null);
      setRenameInput('');
    }
  };

  const ubahNama = (id: string) => {
    setRenameId(id);
    setRenameInput(dipantau[id]);
  };

  const simpanPengaturan = async () => {
    const id = configId.trim();
    if (!id || !tinggiTong || !jarakPenuh) {
      alert("⚠️ Harap isi Kode Tong Asli, Tinggi Maksimal, dan Jarak Mentok!");
      return;
    }

    try {
      await set(ref(database, `Konfigurasi/${id}`), {
        tinggi_tong: parseInt(tinggiTong),
        jarak_penuh: parseInt(jarakPenuh)
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Gagal menyimpan: " + error);
    }
  };

  const muatPengaturan = async () => {
    const id = configId.trim();
    if (!id) {
      alert("⚠️ Masukkan Kode Tong Asli terlebih dahulu untuk memuat datanya!");
      return;
    }

    try {
      const snapshot = await get(ref(database, `Konfigurasi/${id}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        setTinggiTong(data.tinggi_tong?.toString() || "");
        setJarakPenuh(data.jarak_penuh?.toString() || "");
        alert(`✅ Data pengaturan ${id} berhasil dimuat!`);
      } else {
        alert(`⚠️ Belum ada pengaturan yang tersimpan untuk ${id}.`);
        setTinggiTong("");
        setJarakPenuh("");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memuat data.");
    }
  };

  const getStatusTheme = (value: number) => {
    if (value < 50) return {
      fill: 'bg-emerald-500',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      glow: '',
      dot: 'bg-emerald-500',
      blob: 'bg-emerald-50',
      cardHover: 'hover:border-emerald-300 hover:shadow-md',
      iconTheme: 'text-emerald-600'
    };
    if (value < 85) return {
      fill: 'bg-amber-500',
      border: 'border-amber-200',
      text: 'text-amber-700',
      glow: '',
      dot: 'bg-amber-500',
      blob: 'bg-amber-50',
      cardHover: 'hover:border-amber-300 hover:shadow-md',
      iconTheme: 'text-amber-600'
    };
    return {
      fill: 'bg-rose-500',
      border: 'border-rose-200',
      text: 'text-rose-700',
      glow: '',
      dot: 'bg-rose-500',
      blob: 'bg-rose-50',
      cardHover: 'hover:border-rose-300 hover:shadow-md',
      iconTheme: 'text-rose-600'
    };
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden sm:p-4 md:p-6 gap-6 text-gray-800 selection:bg-blue-200 relative">

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{ x: sidebarOpen || !isMobile ? 0 : '-100%' }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className={`fixed md:relative left-0 top-0 bottom-0 shrink-0 w-[320px] h-full bg-white text-gray-800 p-6 shadow-xl z-40 flex flex-col md:rounded-[2rem] border border-gray-200 transition-all duration-500 ${!sidebarOpen && isMobile ? 'pointer-events-none' : ''}`}
      >
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold flex items-center gap-3 group cursor-pointer transition-all">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-100 transition-all duration-300">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <span className="tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">EcoTrack</span>
          </h2>
          {isMobile && (
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500 hover:text-gray-800" />
            </button>
          )}
        </div>

        <div className="space-y-4 mb-8">
          <div className="relative group">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              placeholder="Kode Tong (ex: TONG-001)"
              className="w-full p-4 bg-gray-50 rounded-2xl text-gray-900 border border-gray-200 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 hover:border-gray-300 transition-all placeholder-gray-400 font-medium"
            />
          </div>
          <button
            onClick={tambahPerangkat}
            className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 shadow-sm group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Tambah Perangkat
          </button>
        </div>

        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>Perangkat Aktif</span>
          <div className="h-[1px] flex-1 bg-gray-200"></div>
        </h3>
        
        <div className="flex-grow overflow-y-auto space-y-3 custom-scrollbar pr-2 mb-4">
          {Object.entries(dipantau).map(([id, name]) => {
            const theme = getStatusTheme(realtimeData[id] || 0);
            return (
              <div key={id} className="bg-white p-3.5 rounded-2xl flex items-center justify-between gap-2 group hover:bg-gray-50 border border-gray-200 hover:border-blue-300 transition-all duration-300 relative overflow-hidden cursor-pointer shadow-sm">
                <div className="flex items-center gap-3 overflow-hidden z-10">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${theme.dot}`} />
                  <span className="truncate text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors" title={name}>{name}</span>
                </div>
                <div className="flex gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); ubahNama(id); }}
                    className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); hapusPerangkat(id); }}
                    className="p-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          {Object.keys(dipantau).length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 opacity-60">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 border border-gray-200">
                <Trash className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-center text-gray-500">Belum ada perangkat<br/>yang dipantau</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="flex justify-between items-end pb-4 pt-6 px-4 md:px-2 border-b border-gray-200 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2.5 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200 text-gray-700 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="group cursor-default">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight transition-all duration-500">Dashboard Central</h1>
              <p className="text-gray-500 font-medium mt-1 text-sm transition-colors">{msgGlobal}</p>
            </div>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto px-4 md:px-2 pb-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            {Object.entries(dipantau).map(([id, name]) => {
              const value = realtimeData[id] || 0;
              const isFull = value >= 85;
              const theme = getStatusTheme(value);

              return (
                <motion.div
                  layout
                  key={id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`relative overflow-hidden rounded-[2.5rem] p-6 bg-white border border-gray-200 shadow-sm group transition-all duration-300 hover:-translate-y-1 ${theme.cardHover}`}
                >
                  <div className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full ${theme.blob} opacity-30 transition-opacity duration-300 pointer-events-none`} />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    {/* Header */}
                    <div className="w-full flex justify-between items-start mb-6">
                      <div className="flex flex-col max-w-[65%] gap-2">
                        <h3 className="text-lg font-bold text-gray-800 tracking-tight truncate" title={name}>{name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50 inline-flex items-center px-2.5 py-1 rounded-lg border border-gray-200 transition-colors">
                          <Wifi className="w-3 h-3 mr-1.5 opacity-70" />
                          {id}
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full border ${theme.border} bg-white flex items-center gap-2 shadow-sm transition-all duration-300`}>
                        <div className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        <span className={`text-[10px] font-bold tracking-widest uppercase ${theme.text}`}>
                          {isFull ? 'Kritis' : 'Aman'}
                        </span>
                      </div>
                    </div>

                    {/* The Visual Trash Bin */}
                    <div className="w-full flex justify-center items-center py-4">
                      <div className="relative w-28 h-40">
                        {/* Bin Lid */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-3 rounded-md bg-gray-300 border border-gray-400 z-20 flex justify-center">
                           <div className="absolute -top-1.5 w-10 h-1.5 rounded-t-sm bg-gray-400" />
                        </div>
                        
                        {/* Bin Body */}
                        <div className="absolute inset-0 bg-gray-50 rounded-b-2xl border border-gray-300 overflow-hidden flex items-end justify-center z-10">
                           {/* Background measurement lines */}
                           <div className="absolute inset-0 flex flex-col justify-between py-6 px-2 opacity-30 z-0">
                             <div className="w-full border-b border-dashed border-gray-400"></div>
                             <div className="w-full border-b border-dashed border-gray-400"></div>
                             <div className="w-full border-b border-dashed border-gray-400"></div>
                           </div>

                           {/* Inner filling animation */}
                           <motion.div
                             initial={{ height: 0 }}
                             animate={{ height: `${Math.max(10, value)}%` }} // Give at least small height if 0 to show it's active
                             transition={{ type: 'spring', damping: 20, stiffness: 60 }}
                             className={`w-full ${theme.fill} relative z-10 opacity-90`}
                           >
                              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
                           </motion.div>
                        </div>
                        
                        {/* Percentage display centered inside the bin */}
                        <div className="absolute inset-0 z-30 flex items-center justify-center drop-shadow-md">
                           <span className="text-2xl font-black text-gray-800 tracking-tighter mix-blend-overlay">
                             {value}%
                           </span>
                        </div>

                        {/* Critical Alert Border Pulse */}
                        {isFull && (
                           <div className="absolute inset-0 rounded-b-2xl border-2 border-rose-400 animate-pulse pointer-events-none z-30" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {Object.keys(dipantau).length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-200 relative overflow-hidden transition-all duration-500"
            >
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 flex-shrink-0">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h2>
                  <p className="text-gray-500 font-medium">Kalibrasi sensor jarak pada Smart Bin.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10">
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Hardware ID Target</label>
                  <input
                    type="text"
                    value={configId}
                    onChange={(e) => setConfigId(e.target.value)}
                    placeholder="Contoh: TONG-001"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 hover:border-gray-300 transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Tinggi Maks. (cm)</label>
                  <input
                    type="number"
                    value={tinggiTong}
                    onChange={(e) => setTinggiTong(e.target.value)}
                    placeholder="40"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 hover:border-gray-300 transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block pl-2">Batas Clearance (cm)</label>
                  <input
                    type="number"
                    value={jarakPenuh}
                    onChange={(e) => setJarakPenuh(e.target.value)}
                    placeholder="5"
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 hover:border-gray-300 transition-all font-medium text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4 items-center relative z-10">
                <button
                  onClick={simpanPengaturan}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Save className="w-5 h-5" />
                  Simpan Pengaturan
                </button>
                <button
                  onClick={muatPengaturan}
                  className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold flex items-center gap-2 transition-all border border-gray-200 active:scale-95"
                >
                  <RefreshCw className="w-5 h-5" />
                  Tarik Data
                </button>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-5 py-3 rounded-xl text-sm"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Tersinkronisasi!
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}

          {Object.keys(dipantau).length === 0 && (
            <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center text-center p-8 border hover:border-gray-300 border-dashed border-gray-200 rounded-3xl bg-white mt-4 relative overflow-hidden transition-all duration-300">
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-40 h-40 mb-8 flex items-center justify-center">
                  <div className="relative w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 z-10 shadow-sm">
                    <Trash2 className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="absolute top-4 right-6 w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center z-20 animate-[bounce_4s_ease-in-out_infinite]">
                    <BarChart2 className="w-4 h-4 text-blue-500" />
                  </div>

                  <div className="absolute bottom-6 left-6 w-8 h-8 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center z-20 animate-[bounce_5s_ease-in-out_infinite_1s]">
                    <Wifi className="w-3 h-3 text-emerald-500" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Mulai Pemantauan</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-10 font-medium leading-relaxed">
                  Tambahkan ID perangkat tong sampah Anda untuk memantau kapasitas secara realtime dan menjaga kebersihan.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full text-left">
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center font-bold mb-4">1</div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Cari ID Hardware</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Lihat stiker pada perangkat tong atau mikrokontroler Anda.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center font-bold mb-4">2</div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Ketik di Sidebar</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Masukkan kode tersebut pada form input di menu navigasi.</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white text-blue-600 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center font-bold mb-4">3</div>
                    <h4 className="font-bold text-gray-900 text-sm mb-2">Mulai Pantau</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">Klik "Tambah" dan visualisasi data akan langsung muncul.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Rename Modal */}
      <AnimatePresence>
        {renameId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setRenameId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ubah Nama</h3>
              <p className="text-sm text-gray-500 mb-6">Berikan alias untuk <strong>{renameId}</strong> agar mudah dikenali.</p>
              
              <input
                type="text"
                autoFocus
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmUbahNama()}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-medium text-gray-900 mb-8 placeholder-gray-400"
                placeholder="Misal: Tong Taman Depan"
              />
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setRenameId(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmUbahNama}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 shadow-sm"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl border border-gray-200 text-center"
            >
              <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Perangkat</h3>
              <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">Apakah Anda yakin berhenti memantau tong <strong className="text-gray-800">{deleteId}</strong>? Data riwayat pada tampilan akan hilang.</p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-5 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={confirmHapus}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all active:scale-95 shadow-sm"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Exclude Chatbot from Main Z-index space to float properly */}
      <div className="relative z-50">
        <Chatbot realtimeData={realtimeData} />
        <LiveComment />
      </div>
    </div>
  );
}
