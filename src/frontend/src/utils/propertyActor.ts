import { Actor, HttpAgent } from "@icp-sdk/core/agent";
import type { Identity } from "@icp-sdk/core/agent";
import { IDL } from "@icp-sdk/core/candid";
import { loadConfig } from "../config";
import type {
  BackendPropertyInput,
  BackendPropertyRaw,
} from "../types/property";

// Candid IDL for property methods only
const PropertyInput = IDL.Record({
  title: IDL.Text,
  price: IDL.Nat,
  locationState: IDL.Text,
  locationCity: IDL.Text,
  locationArea: IDL.Text,
  propertyType: IDL.Text,
  listingFor: IDL.Text,
  description: IDL.Text,
  imageKeys: IDL.Vec(IDL.Text),
  bedrooms: IDL.Nat,
  bathrooms: IDL.Nat,
  sizeSqm: IDL.Nat,
  amenities: IDL.Vec(IDL.Text),
});

const PropertyType = IDL.Record({
  id: IDL.Text,
  title: IDL.Text,
  price: IDL.Nat,
  locationState: IDL.Text,
  locationCity: IDL.Text,
  locationArea: IDL.Text,
  propertyType: IDL.Text,
  listingFor: IDL.Text,
  description: IDL.Text,
  imageKeys: IDL.Vec(IDL.Text),
  bedrooms: IDL.Nat,
  bathrooms: IDL.Nat,
  sizeSqm: IDL.Nat,
  amenities: IDL.Vec(IDL.Text),
  ownerId: IDL.Text,
  status: IDL.Text,
  createdAt: IDL.Nat,
});

const propertyIdlFactory: IDL.InterfaceFactory = ({ IDL: _IDL }) => {
  return _IDL.Service({
    createProperty: _IDL.Func([PropertyInput], [_IDL.Text], []),
    getProperties: _IDL.Func([], [_IDL.Vec(PropertyType)], ["query"]),
    getMyProperties: _IDL.Func([], [_IDL.Vec(PropertyType)], ["query"]),
    getProperty: _IDL.Func([_IDL.Text], [_IDL.Opt(PropertyType)], ["query"]),
    deleteProperty: _IDL.Func([_IDL.Text], [_IDL.Bool], []),
  });
};

export interface PropertyActor {
  createProperty(input: BackendPropertyInput): Promise<string>;
  getProperties(): Promise<BackendPropertyRaw[]>;
  getMyProperties(): Promise<BackendPropertyRaw[]>;
  getProperty(id: string): Promise<[] | [BackendPropertyRaw]>;
  deleteProperty(id: string): Promise<boolean>;
}

export async function createPropertyActor(
  identity?: Identity,
): Promise<PropertyActor> {
  const config = await loadConfig();
  const agent = new HttpAgent({
    identity,
    host: config.backend_host,
  });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  return Actor.createActor(propertyIdlFactory, {
    agent,
    canisterId: config.backend_canister_id,
  }) as unknown as PropertyActor;
}
