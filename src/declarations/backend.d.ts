import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface PropertyInput {
  title: string;
  price: bigint;
  locationState: string;
  locationCity: string;
  locationArea: string;
  propertyType: string;
  listingFor: string;
  description: string;
  imageKeys: string[];
  bedrooms: bigint;
  bathrooms: bigint;
  sizeSqm: bigint;
  amenities: string[];
}

export interface Property {
  id: string;
  title: string;
  price: bigint;
  locationState: string;
  locationCity: string;
  locationArea: string;
  propertyType: string;
  listingFor: string;
  description: string;
  imageKeys: string[];
  bedrooms: bigint;
  bathrooms: bigint;
  sizeSqm: bigint;
  amenities: string[];
  ownerId: string;
  status: string;
  createdAt: bigint;
}

export interface _SERVICE {
  createProperty: ActorMethod<[PropertyInput], string>;
  getProperties: ActorMethod<[], Property[]>;
  getMyProperties: ActorMethod<[], Property[]>;
  getProperty: ActorMethod<[string], [] | [Property]>;
  updatePropertyStatus: ActorMethod<[string, string], boolean>;
  deleteProperty: ActorMethod<[string], boolean>;
  getCallerUserRole: ActorMethod<[], { admin: null } | { user: null } | { guest: null }>;
  isCallerAdmin: ActorMethod<[], boolean>;
  _initializeAccessControlWithSecret: ActorMethod<[string], void>;
  assignCallerUserRole: ActorMethod<[Principal, { admin: null } | { user: null } | { guest: null }], void>;
  _caffeineStorageCreateCertificate: ActorMethod<[string], { method: string; blob_hash: string }>;
  isStripeConfigured: ActorMethod<[], boolean>;
}

export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: ({ IDL }: { IDL: IDL }) => IDL.Type[];
