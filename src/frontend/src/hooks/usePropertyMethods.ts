import { HttpAgent } from "@icp-sdk/core/agent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loadConfig } from "../config";
import type {
  BackendPropertyInput,
  BackendPropertyRaw,
} from "../types/property";
import { backendToDisplay } from "../types/property";
import type { DisplayProperty } from "../types/property";
import { StorageClient } from "../utils/StorageClient";
import {
  type PropertyActor,
  createPropertyActor,
} from "../utils/propertyActor";
import { useInternetIdentity } from "./useInternetIdentity";

function usePropertyActor() {
  const { identity } = useInternetIdentity();
  return useQuery<PropertyActor>({
    queryKey: ["propertyActor", identity?.getPrincipal().toString()],
    queryFn: () => createPropertyActor(identity ?? undefined),
    staleTime: Number.POSITIVE_INFINITY,
  });
}

function useStorageClient() {
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["storageClient", identity?.getPrincipal().toString()],
    queryFn: async () => {
      const config = await loadConfig();
      const agent = new HttpAgent({
        identity: identity ?? undefined,
        host: config.backend_host,
      });
      if (config.backend_host?.includes("localhost")) {
        await agent.fetchRootKey().catch(() => {});
      }
      return new StorageClient(
        config.bucket_name,
        config.storage_gateway_url,
        config.backend_canister_id,
        config.project_id,
        agent,
      );
    },
    staleTime: Number.POSITIVE_INFINITY,
  });
}

export function useGetProperties() {
  const actorQuery = usePropertyActor();
  return useQuery<DisplayProperty[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      if (!actorQuery.data) return [];
      const raw = await actorQuery.data.getProperties();
      return raw.map(backendToDisplay);
    },
    enabled: !!actorQuery.data,
  });
}

export function useGetMyProperties() {
  const actorQuery = usePropertyActor();
  const { identity } = useInternetIdentity();
  return useQuery<DisplayProperty[]>({
    queryKey: ["myProperties", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actorQuery.data) return [];
      const raw = await actorQuery.data.getMyProperties();
      return raw.map(backendToDisplay);
    },
    enabled: !!actorQuery.data && !!identity,
  });
}

export function useGetProperty(id: string) {
  const actorQuery = usePropertyActor();
  return useQuery<DisplayProperty | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actorQuery.data) return null;
      const result = await actorQuery.data.getProperty(id);
      if (result.length === 0) return null;
      return backendToDisplay(result[0]);
    },
    enabled: !!actorQuery.data && !!id,
  });
}

export function useDeleteProperty() {
  const actorQuery = usePropertyActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actorQuery.data) throw new Error("Not connected");
      return actorQuery.data.deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });
}

export interface SubmitPropertyArgs {
  formData: {
    title: string;
    type: string;
    listingFor: string;
    price: string;
    description: string;
    state: string;
    city: string;
    area: string;
    bedrooms: string;
    bathrooms: string;
    sizeSqm: string;
    amenities: string[];
  };
  imageFiles: File[];
  onProgress?: (pct: number) => void;
}

export function useSubmitProperty() {
  const actorQuery = usePropertyActor();
  const storageQuery = useStorageClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      formData,
      imageFiles,
      onProgress,
    }: SubmitPropertyArgs) => {
      if (!actorQuery.data) throw new Error("Actor not ready");
      if (!storageQuery.data) throw new Error("Storage not ready");

      const actor = actorQuery.data;
      const storageClient = storageQuery.data;

      // Upload images and collect hashes
      const imageKeys: string[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const bytes = new Uint8Array(await file.arrayBuffer());
        const { hash } = await storageClient.putFile(bytes, (pct) => {
          if (onProgress) {
            onProgress(((i + pct / 100) / imageFiles.length) * 90);
          }
        });
        imageKeys.push(hash);
      }

      const input: BackendPropertyInput = {
        title: formData.title,
        price: BigInt(Math.round(Number(formData.price))),
        locationState: formData.state,
        locationCity: formData.city,
        locationArea: formData.area,
        propertyType: formData.type,
        listingFor: formData.listingFor,
        description: formData.description,
        imageKeys,
        bedrooms: BigInt(Number(formData.bedrooms) || 0),
        bathrooms: BigInt(Number(formData.bathrooms) || 0),
        sizeSqm: BigInt(Number(formData.sizeSqm) || 0),
        amenities: formData.amenities,
      };

      if (onProgress) onProgress(95);
      const id = await actor.createProperty(input);
      if (onProgress) onProgress(100);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });
}

export function useBlobUrl(hash: string | undefined) {
  const storageQuery = useStorageClient();
  return useQuery<string | null>({
    queryKey: ["blobUrl", hash],
    queryFn: async () => {
      if (!storageQuery.data || !hash) return null;
      return storageQuery.data.getDirectURL(hash);
    },
    enabled: !!storageQuery.data && !!hash,
    staleTime: 1000 * 60 * 10, // 10 min
  });
}

export function useStorageUrls(hashes: string[]) {
  const storageQuery = useStorageClient();
  return useQuery<(string | null)[]>({
    queryKey: ["blobUrls", ...hashes],
    queryFn: async () => {
      if (!storageQuery.data) return hashes.map(() => null);
      return Promise.all(
        hashes.map((h) =>
          h ? storageQuery.data!.getDirectURL(h).catch(() => null) : null,
        ),
      );
    },
    enabled: !!storageQuery.data,
    staleTime: 1000 * 60 * 10,
  });
}
