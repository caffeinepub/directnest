import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

actor {
  // Include prefabricated components
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    stripeConfig := ?config;
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    #failed { error = "Not implemented yet" };
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    "Not implemented yet";
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ---- Property Listing System ----

  type PropertyInput = {
    title : Text;
    price : Nat;
    locationState : Text;
    locationCity : Text;
    locationArea : Text;
    propertyType : Text;
    listingFor : Text;
    description : Text;
    imageKeys : [Text];
    bedrooms : Nat;
    bathrooms : Nat;
    sizeSqm : Nat;
    amenities : [Text];
  };

  type Property = {
    id : Text;
    title : Text;
    price : Nat;
    locationState : Text;
    locationCity : Text;
    locationArea : Text;
    propertyType : Text;
    listingFor : Text;
    description : Text;
    imageKeys : [Text];
    bedrooms : Nat;
    bathrooms : Nat;
    sizeSqm : Nat;
    amenities : [Text];
    ownerId : Text;
    status : Text;
    createdAt : Int;
  };

  var properties : [Property] = [];
  var nextPropertyId : Nat = 1;

  public shared ({ caller }) func createProperty(input : PropertyInput) : async Text {
    let id = "prop-" # nextPropertyId.toText();
    nextPropertyId += 1;
    let prop : Property = {
      id = id;
      title = input.title;
      price = input.price;
      locationState = input.locationState;
      locationCity = input.locationCity;
      locationArea = input.locationArea;
      propertyType = input.propertyType;
      listingFor = input.listingFor;
      description = input.description;
      imageKeys = input.imageKeys;
      bedrooms = input.bedrooms;
      bathrooms = input.bathrooms;
      sizeSqm = input.sizeSqm;
      amenities = input.amenities;
      ownerId = caller.toText();
      status = "approved";
      createdAt = Time.now();
    };
    properties := properties.concat([prop]);
    id;
  };

  public query func getProperties() : async [Property] {
    properties.filter(func(p : Property) : Bool { p.status == "approved" });
  };

  public query ({ caller }) func getMyProperties() : async [Property] {
    let callerText = caller.toText();
    properties.filter(func(p : Property) : Bool { p.ownerId == callerText });
  };

  public query func getProperty(id : Text) : async ?Property {
    properties.find(func(p : Property) : Bool { p.id == id });
  };

  public shared ({ caller }) func updatePropertyStatus(id : Text, newStatus : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    let updated = properties.map(func(p : Property) : Property {
      if (p.id == id) { { p with status = newStatus } } else { p };
    });
    properties := updated;
    true;
  };

  public shared ({ caller }) func deleteProperty(id : Text) : async Bool {
    let callerText = caller.toText();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let target = properties.find(func(p : Property) : Bool { p.id == id });
    switch (target) {
      case (null) { false };
      case (?prop) {
        if (prop.ownerId == callerText or isAdmin) {
          properties := properties.filter(func(p : Property) : Bool { p.id != id });
          true;
        } else {
          false;
        };
      };
    };
  };
};
