import { supabase } from '@/supabase'

function normalizeDestinationImage(image) {
  if (!image) {
    return null
  }

  const imageUrl = image.image_url || image.image || image.url || image.src

  if (!imageUrl) {
    return null
  }

  return {
    ...image,
    image_url: imageUrl,
    caption: image.caption || image.title || image.name || '',
    order: image.order ?? image.sort_order ?? image.position ?? 0,
  }
}

function normalizeDestinationVideo(video) {
  if (!video) {
    return null
  }

  const videoUrl = video.video_url || video.video || video.url || video.src

  if (!videoUrl) {
    return null
  }

  return {
    ...video,
    video_url: videoUrl,
    poster_url: video.poster_url || video.poster || '',
    caption: video.caption || '',
    order: video.order ?? video.sort_order ?? video.position ?? 0,
    is_featured: Boolean(video.is_featured),
  }
}

function normalizeDestination(destination) {
  if (!destination) {
    return destination
  }

  const destinationImages = Array.isArray(destination.destination_images)
    ? destination.destination_images
      .map(normalizeDestinationImage)
      .filter(Boolean)
      .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
    : destination.destination_images

  return {
    ...destination,
    image: destination.image || destination.image_url,
    reviewCount: destination.reviewCount ?? destination.review_count ?? 0,
    destination_images: destinationImages,
  }
}

function attachDestinationVideos(destinations, videos) {
  return destinations.map((destination) => {
    const destinationVideos = videos
      .filter((video) => Number(video.destination_id) === Number(destination.id))
      .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
    const featuredVideo = destinationVideos.find((video) => video.is_featured) || destinationVideos[0]

    return {
      ...destination,
      destination_videos: destinationVideos,
      video: featuredVideo?.video_url || destination.video || '',
      videoPoster: featuredVideo?.poster_url || destination.image || '',
    }
  })
}

export async function getDestinations() {
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .order('id')
  if (error) throw error

  const destinations = (data || []).map(normalizeDestination)
  const videos = await getVideosForDestinations(destinations.map((destination) => destination.id))
  return attachDestinationVideos(destinations, videos)
}

export async function getDestination(id) {
  const numericId = Number(id)

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', numericId)
    .maybeSingle()
  if (error) throw error
  return normalizeDestination(data) || null
}

async function getVideosForDestinations(destinationIds) {
  if (!destinationIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('destination_videos')
    .select('*')
    .in('destination_id', destinationIds)
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) {
    return []
  }

  return (data || [])
    .map(normalizeDestinationVideo)
    .filter(Boolean)
}

export async function getDestinationVideos(destinationId) {
  const { data, error } = await supabase
    .from('destination_videos')
    .select('*')
    .eq('destination_id', Number(destinationId))
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) {
    return []
  }

  return (data || [])
    .map(normalizeDestinationVideo)
    .filter(Boolean)
}

export async function getDestinationImages(destinationId) {
  const { data, error } = await supabase
    .from('destination_images')
    .select('*')
    .eq('destination_id', Number(destinationId))
  if (error) throw error

  return (data || [])
    .map(normalizeDestinationImage)
    .filter(Boolean)
    .sort((left, right) => Number(left.order || 0) - Number(right.order || 0))
}

export async function getDestinationWithImages(id) {
  const [destination, destinationImages, destinationVideos] = await Promise.all([
    getDestination(id),
    getDestinationImages(id),
    getDestinationVideos(id),
  ])
  const featuredVideo = destinationVideos.find((video) => video.is_featured) || destinationVideos[0]

  return destination
    ? {
        ...destination,
        destination_images: destinationImages,
        destination_videos: destinationVideos,
        video: featuredVideo?.video_url || destination.video || '',
        videoPoster: featuredVideo?.poster_url || destination.image || '',
      }
    : null
}

export async function addDestination(payload) {
  const { data, error } = await supabase
    .from('destinations')
    .insert([payload])
    .select()
    .single()
  if (error) throw error
  return data
}
