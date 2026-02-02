"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMapEntityDetails,
  getMapLayers,
  getMapMarkers,
  searchEntitiesForMap,
  updateEntityMapPosition,
} from "@/lib/queries/map";
import { createQueryRetry } from "@/lib/utils";
import type { WikiEntityType } from "@/types/database.types";

export const mapKeys = {
  all: ["map"] as const,
  markers: () => [...mapKeys.all, "markers"] as const,
  markersFiltered: (filters: {
    layer?: string;
    entityTypes?: WikiEntityType[];
  }) => [...mapKeys.markers(), filters] as const,
  layers: () => [...mapKeys.all, "layers"] as const,
  entityDetails: (id: string) => [...mapKeys.all, "entity", id] as const,
  search: (query: string) => [...mapKeys.all, "search", query] as const,
};

const STALE_TIME = 1000 * 60 * 5; // 5 minutes
const GC_TIME = 1000 * 60 * 30; // 30 minutes

const shouldRetry = createQueryRetry(2);

/**
 * Hook to fetch all map markers with optional filtering
 */
export function useMapMarkers(options?: {
  layer?: string;
  entityTypes?: WikiEntityType[];
}) {
  return useQuery({
    queryKey: mapKeys.markersFiltered(options || {}),
    queryFn: () => getMapMarkers(options),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

/**
 * Hook to fetch detailed entity information for map popups
 */
export function useMapEntityDetails(id: string | null) {
  return useQuery({
    queryKey: mapKeys.entityDetails(id || ""),
    queryFn: () => (id ? getMapEntityDetails(id) : null),
    enabled: !!id,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

/**
 * Hook to fetch all available map layers
 */
export function useMapLayers() {
  return useQuery({
    queryKey: mapKeys.layers(),
    queryFn: getMapLayers,
    staleTime: STALE_TIME * 2, // Layers change less frequently
    gcTime: GC_TIME,
    retry: shouldRetry,
  });
}

/**
 * Hook to search entities for adding to map
 */
export function useMapEntitySearch(query: string) {
  return useQuery({
    queryKey: mapKeys.search(query),
    queryFn: () => searchEntitiesForMap(query),
    enabled: query.length >= 2,
    staleTime: 1000 * 60, // 1 minute
    gcTime: GC_TIME,
  });
}

/**
 * Hook to update entity map position
 */
export function useUpdateEntityPosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      x,
      y,
      layer,
    }: {
      id: string;
      x: number;
      y: number;
      layer?: string;
    }) => updateEntityMapPosition(id, x, y, layer),
    onSuccess: () => {
      // Invalidate all marker queries to refresh the map
      queryClient.invalidateQueries({ queryKey: mapKeys.markers() });
    },
  });
}

/**
 * Map view state hook for zoom and center
 */
export interface MapViewState {
  center: [number, number];
  zoom: number;
}

export const DEFAULT_MAP_VIEW: MapViewState = {
  center: [0, 0], // Center of the map
  zoom: 2,
};

export const MAP_BOUNDS: [[number, number], [number, number]] = [
  [-90, -180], // Southwest corner
  [90, 180], // Northeast corner
];

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;
