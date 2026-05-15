export const tripTypes = ['Sendiri', 'Berdua', 'Keluarga', 'Teman/Grup']

export const durationOptions = [1, 2, 3, 4, 5]

export const categoryOptions = ['Alam', 'Budaya', 'Bahari', 'Sejarah', 'Kuliner', 'Religi']

export const areaOptions = [
  'Pekanbaru',
  'Siak',
  'Kampar',
  'Dumai',
  'Bengkalis',
  'Rokan Hilir',
  'Indragiri Hulu',
  'Semua Riau',
]

export const budgetOptions = ['Hemat', 'Standar', 'Premium']

export const culinaryRecommendations = [
  'Mie Sagu',
  'Gulai Ikan Patin',
  'Roti Jala',
  'Asam Pedas Baung',
  'Bolu Kemojo',
  'Lempuk Durian',
  'Sate Rusa khas daerah',
  'Kopi Liberika Riau',
]

export const accommodationRecommendations = {
  Hemat: [
    {
      name: 'Homestay Tepian Siak',
      type: 'Homestay',
      area: 'Siak',
      note: 'Nyaman untuk short stay dengan suasana lokal yang hangat.',
    },
    {
      name: 'Guesthouse Lancang Kuning',
      type: 'Guesthouse',
      area: 'Pekanbaru',
      note: 'Pilihan ekonomis dekat pusat kuliner dan transportasi.',
    },
  ],
  Standar: [
    {
      name: 'Hotel Serambi Riau',
      type: 'Hotel',
      area: 'Kampar',
      note: 'Keseimbangan antara kenyamanan, lokasi, dan akses wisata.',
    },
    {
      name: 'Riverfront Stay Dumai',
      type: 'Hotel',
      area: 'Dumai',
      note: 'Cocok untuk perjalanan keluarga dengan fasilitas lengkap.',
    },
  ],
  Premium: [
    {
      name: 'The Siak Heritage Suites',
      type: 'Boutique Hotel',
      area: 'Siak',
      note: 'Pengalaman menginap premium dengan nuansa heritage modern.',
    },
    {
      name: 'Riau Grand Premiere',
      type: 'Luxury Hotel',
      area: 'Pekanbaru',
      note: 'Ideal untuk perjalanan premium dan itinerary multi-hari.',
    },
  ],
}

export const plannerFallbackDestinations = [
  {
    id: 'fallback-1',
    name: 'Tepian Sungai Siak',
    category: 'Budaya',
    location: 'Pekanbaru',
    rating: 4.6,
    latitude: 0.533,
    longitude: 101.45,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
    description: 'Area santai tepi sungai untuk menikmati suasana kota dan lanskap sore.',
  },
  {
    id: 'fallback-2',
    name: 'Pantai Rupat',
    category: 'Bahari',
    location: 'Bengkalis',
    rating: 4.7,
    latitude: 1.85,
    longitude: 101.5,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Pesisir berpasir lembut dengan nuansa santai untuk itinerary bahari.',
  },
  {
    id: 'fallback-3',
    name: 'Masjid Agung An-Nur',
    category: 'Religi',
    location: 'Pekanbaru',
    rating: 4.8,
    latitude: 0.507,
    longitude: 101.447,
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?auto=format&fit=crop&w=1200&q=80',
    description: 'Ikon religi dan arsitektur megah untuk perjalanan yang lebih reflektif.',
  },
]
