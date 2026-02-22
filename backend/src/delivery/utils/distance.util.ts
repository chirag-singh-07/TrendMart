import { IDeliveryPartner } from "../../interfaces/index.js";

/**
 * Calculates the Haversine distance between two points on the Earth's surface.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  if (lat1 === lat2 && lon1 === lon2) return 0;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Checks if a point is within a certain radius of a center.
 * @param center Center coordinates { lat, lon }
 * @param point Point coordinates { lat, lon }
 * @param radiusKm Radius in kilometers
 */
export const isWithinRadius = (
  center: { lat: number; lon: number },
  point: { lat: number; lon: number },
  radiusKm: number,
): boolean => {
  const distance = calculateDistance(
    center.lat,
    center.lon,
    point.lat,
    point.lon,
  );
  return distance <= radiusKm;
};

/**
 * Sorts an array of delivery partners by distance from a target location.
 * Partners without a current location are moved to the end.
 */
export const sortByDistance = (
  partners: IDeliveryPartner[],
  targetLat: number,
  targetLon: number,
): IDeliveryPartner[] => {
  return [...partners].sort((a, b) => {
    if (!a.currentLocation) return 1;
    if (!b.currentLocation) return -1;

    const distA = calculateDistance(
      targetLat,
      targetLon,
      a.currentLocation.latitude,
      a.currentLocation.longitude,
    );
    const distB = calculateDistance(
      targetLat,
      targetLon,
      b.currentLocation.latitude,
      b.currentLocation.longitude,
    );

    return distA - distB;
  });
};

/**
 * Estimates travel time based on distance and vehicle type.
 */
export const estimateTravelTime = (
  distanceKm: number,
  vehicleType: "bike" | "scooter" | "car" | "van" | "truck",
): number => {
  let speedKmh = 30; // default

  switch (vehicleType) {
    case "bike":
    case "scooter":
      speedKmh = 30;
      break;
    case "car":
    case "van":
      speedKmh = 40;
      break;
    case "truck":
      speedKmh = 25;
      break;
  }

  return (distanceKm / speedKmh) * 60;
};
