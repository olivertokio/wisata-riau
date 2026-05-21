export const destinations = [
  {
    id: 1,
    name: 'Pantai Rupat',
    category: 'Bahari',
    location: 'Bengkalis',
    rating: 4.8,
    reviewCount: 128,
    latitude: 2.125054,
    longitude: 101.6558571,
    // Ganti gambar hero destinasi Pantai Rupat di sini.
    // Saat ini memakai file lokal dari folder: public/pantai-rupat/
    image: '/pantai-rupat/rupat.jpg',
    description: 'kawasan wisata bahari andalan di Kabupaten Bengkalis, Riau, yang terkenal dengan hamparan pasir putih bersih dan garis pantainya yang panjang.',
  },
  {
    id: 4,
    name: 'Istana Siak Sri Indrapura',
    // Untuk kategori ganda, pisahkan dengan koma. Contoh: 'Budaya,Sejarah'
    category: 'Budaya,Sejarah',
    location: 'Siak Sri Indrapura',
    rating: 4.8,
    reviewCount: 113,
    latitude: 0.794663,
    longitude: 102.048819,
    // Ganti gambar hero destinasi Siak di sini.
    // Saat ini memakai file lokal dari folder: public/siak-gallery/
    image: '/siak-gallery/bg.jpg',
    description: 'Peninggalan Kesultanan Siak dengan arsitektur megah dan koleksi sejarah Melayu yang kuat.',
  },

  {
    id: 7,
    name: 'Tangsi Belanda',
    category: 'Sejarah',
    location: 'Kecamatan Mempura, Kabupaten Siak',
    rating: 4.7,
    reviewCount: 96,
    latitude: 0.7895168,
    longitude: 102.0540545,
    // Ganti gambar hero destinasi Tangsi Belanda di sini.
    // Saat ini memakai file lokal dari folder: public/tangsi-belanda/
    image: '/tangsi-belanda/bg1.jpg',
    description: 'Bangunan peninggalan militer Belanda yang dibangun sekitar tahun 1860, terletak di Kecamatan Mempura dan masih berdiri kokoh.',
  },
  {
    id: 8,
    // Dummy destinasi tambahan untuk itinerary area Siak agar agenda malam tidak meloncat jauh ke luar area.
    name: 'Tepian Bandar Sungai Jantan',
    category: 'Budaya,Sejarah',
    location: 'Siak Sri Indrapura',
    rating: 4.6,
    reviewCount: 64,
    // Koordinat sementara dibuat mendekati kawasan pusat wisata Siak.
    // Silakan ganti jika nanti sudah ada titik Google Maps yang lebih presisi.
    latitude: 0.792193,
    longitude: 102.048490,
    // Ganti gambar hero destinasi Tepian Bandar Sungai Jantan di sini.
    image: '/sungai-jantan/bg.jpg',
    description: 'Area ruang terbuka hijau di tepi sungai ini menjadi lokasi favorit warga dan wisatawan untuk bersantai. Dilengkapi gazebo modern dan tulisan "Tepian Bandar Sungai Jantan" yang menyala terang.',
  },
  {
    id: 9,
    name: 'Rumah Datuk Pesisir',
    // Rumah Datuk Pesisir terkait kuat dengan sejarah dan budaya Melayu Siak.
    category: 'Budaya,Sejarah',
    location: 'Kecamatan Mempura, Kabupaten Siak',
    rating: 4.6,
    reviewCount: 58,
    // Koordinat sementara dibuat mendekati kawasan Mempura dan disebut berdekatan dengan Tangsi Belanda.
    // Silakan ganti jika nanti Anda sudah punya titik Google Maps yang lebih presisi.
    latitude: 0.792308,
    longitude: 102.044608,
    // Ganti gambar hero destinasi Rumah Datuk Pesisir di sini.
    image: '/datuk-pesisir/bg.jpg',
    description: 'Rumah panggung bersejarah di kawasan Mempura yang dahulu menjadi tempat tinggal Datuk Pesisir, salah satu pembesar penting di lingkungan Kesultanan Siak. Lokasinya berada di sekitar koridor wisata sejarah yang terhubung dengan Tangsi Belanda dan kawasan tepi Sungai Siak.',
  },

  {
    id: 2,
    name: 'Candi Muara Takus',
    category: 'Sejarah',
    location: 'Kampar',
    rating: 4.7,
    reviewCount: 96,
    latitude: 0.335,
    longitude: 100.642,
    image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=1400&q=80',
    description: 'Situs bersejarah peninggalan Buddha yang menjadi ikon wisata budaya di Provinsi Riau.',
  },
  {
    id: 3,
    name: 'Ulu Kasok',
    category: 'Alam',
    location: 'Kampar',
    rating: 4.9,
    reviewCount: 142,
    latitude: 0.279,
    longitude: 100.775,
    image: 'https://images.unsplash.com/photo-1703769605297-cc74106244d9?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Kawasan perbukitan dengan pemandangan danau yang sering dijuluki Raja Ampat dari Riau.',
  },

  {
    id: 5,
    name: 'Air Terjun Aek Martua',
    category: 'Alam',
    location: 'Rokan Hulu',
    rating: 4.6,
    reviewCount: 78,
    latitude: 0.963,
    longitude: 100.421,
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1400&q=80',
    description: 'Air terjun bertingkat dengan suasana hutan tropis yang cocok untuk petualangan akhir pekan.',
  },
  {
    id: 6,
    name: 'Pasar Bawah Pekanbaru',
    category: 'Kuliner',
    location: 'Pekanbaru',
    rating: 4.5,
    reviewCount: 89,
    latitude: 0.535,
    longitude: 101.447,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80',
    description: 'Area belanja dan kuliner legendaris untuk menikmati oleh-oleh, kopi, dan suasana kota lama.',
  },
]

export const reviews = [
  {
    id: 1,
    destinationId: 1,
    name: 'Alya',
    rating: 5,
    comment: 'Pantainya bersih dan suasananya cocok untuk liburan santai.',
  },
  {
    id: 2,
    destinationId: 2,
    name: 'Rafi',
    rating: 4,
    comment: 'Tempat bersejarah yang menarik untuk belajar budaya dan foto.',
  },
]
