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

  // ========================
  // USER PROFILES
  // ========================

  type UserProfile = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    role : Text;
    avatarKey : Text;
    verificationStatus : Text;
    bio : Text;
    createdAt : Int;
    updatedAt : Int;
  };

  type UserProfileInput = {
    name : Text;
    email : Text;
    phone : Text;
    role : Text;
    avatarKey : Text;
    bio : Text;
  };

  var users : [UserProfile] = [];

  public shared ({ caller }) func createOrUpdateUserProfile(input : UserProfileInput) : async Text {
    let callerId = caller.toText();
    let now = Time.now();
    let existing = users.find(func(u : UserProfile) : Bool { u.id == callerId });
    switch (existing) {
      case (?u) {
        users := users.map(func(x : UserProfile) : UserProfile {
          if (x.id == callerId) {
            {
              id = callerId;
              name = input.name;
              email = input.email;
              phone = input.phone;
              role = input.role;
              avatarKey = input.avatarKey;
              verificationStatus = x.verificationStatus;
              bio = input.bio;
              createdAt = x.createdAt;
              updatedAt = now;
            }
          } else { x };
        });
      };
      case (null) {
        let newUser : UserProfile = {
          id = callerId;
          name = input.name;
          email = input.email;
          phone = input.phone;
          role = input.role;
          avatarKey = input.avatarKey;
          verificationStatus = "unverified";
          bio = input.bio;
          createdAt = now;
          updatedAt = now;
        };
        users := users.concat([newUser]);
      };
    };
    callerId;
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    let callerId = caller.toText();
    users.find(func(u : UserProfile) : Bool { u.id == callerId });
  };

  public query func getUserProfile(userId : Text) : async ?UserProfile {
    users.find(func(u : UserProfile) : Bool { u.id == userId });
  };

  public query ({ caller }) func getAllUsers() : async [UserProfile] {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      users;
    } else {
      [];
    };
  };

  // ========================
  // PROPERTY LISTING SYSTEM
  // ========================

  // Legacy property type (v1 — without agentId) used for stable migration only.
  // This var receives old on-chain data during upgrade; postupgrade migrates it
  // into `propertiesV2` (which holds the current shape with agentId).
  type PropertyV1 = {
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

  // Receives old stable data under the original variable name.
  var properties : [PropertyV1] = [];

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
    agentId : Text;
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
    agentId : Text;
    status : Text;
    createdAt : Int;
  };

  // Current property store (v2 — with agentId).
  var propertiesV2 : [Property] = [];
  var nextPropertyId : Nat = 1;

  // Migrate legacy properties into propertiesV2 on upgrade.
  system func postupgrade() {
    if (properties.size() > 0 and propertiesV2.size() == 0) {
      propertiesV2 := properties.map(func(p : PropertyV1) : Property {
        {
          id = p.id;
          title = p.title;
          price = p.price;
          locationState = p.locationState;
          locationCity = p.locationCity;
          locationArea = p.locationArea;
          propertyType = p.propertyType;
          listingFor = p.listingFor;
          description = p.description;
          imageKeys = p.imageKeys;
          bedrooms = p.bedrooms;
          bathrooms = p.bathrooms;
          sizeSqm = p.sizeSqm;
          amenities = p.amenities;
          ownerId = p.ownerId;
          agentId = "";
          status = p.status;
          createdAt = p.createdAt;
        }
      });
      properties := [];
    };
  };

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
      agentId = input.agentId;
      status = "approved";
      createdAt = Time.now();
    };
    propertiesV2 := propertiesV2.concat([prop]);
    id;
  };

  public query func getProperties() : async [Property] {
    propertiesV2.filter(func(p : Property) : Bool { p.status == "approved" });
  };

  public query ({ caller }) func getMyProperties() : async [Property] {
    let callerText = caller.toText();
    propertiesV2.filter(func(p : Property) : Bool { p.ownerId == callerText });
  };

  public query func getProperty(id : Text) : async ?Property {
    propertiesV2.find(func(p : Property) : Bool { p.id == id });
  };

  public shared ({ caller }) func updatePropertyStatus(id : Text, newStatus : Text) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    propertiesV2 := propertiesV2.map(func(p : Property) : Property {
      if (p.id == id) { { p with status = newStatus } } else { p };
    });
    true;
  };

  public shared ({ caller }) func deleteProperty(id : Text) : async Bool {
    let callerText = caller.toText();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let target = propertiesV2.find(func(p : Property) : Bool { p.id == id });
    switch (target) {
      case (null) { false };
      case (?prop) {
        if (prop.ownerId == callerText or isAdmin) {
          propertiesV2 := propertiesV2.filter(func(p : Property) : Bool { p.id != id });
          true;
        } else {
          false;
        };
      };
    };
  };

  // ========================
  // MESSAGES
  // ========================

  type Message = {
    id : Text;
    senderId : Text;
    receiverId : Text;
    propertyId : Text;
    content : Text;
    createdAt : Int;
    isRead : Bool;
  };

  var messages : [Message] = [];
  var nextMessageId : Nat = 1;

  public shared ({ caller }) func sendMessage(receiverId : Text, propertyId : Text, content : Text) : async Text {
    let id = "msg-" # nextMessageId.toText();
    nextMessageId += 1;
    let msg : Message = {
      id = id;
      senderId = caller.toText();
      receiverId = receiverId;
      propertyId = propertyId;
      content = content;
      createdAt = Time.now();
      isRead = false;
    };
    messages := messages.concat([msg]);
    id;
  };

  public query ({ caller }) func getMyMessages() : async [Message] {
    let callerId = caller.toText();
    messages.filter(func(m : Message) : Bool {
      m.senderId == callerId or m.receiverId == callerId;
    });
  };

  public query ({ caller }) func getConversation(otherUserId : Text) : async [Message] {
    let callerId = caller.toText();
    messages.filter(func(m : Message) : Bool {
      (m.senderId == callerId and m.receiverId == otherUserId) or
      (m.senderId == otherUserId and m.receiverId == callerId);
    });
  };

  public shared ({ caller }) func markMessageRead(messageId : Text) : async Bool {
    let callerId = caller.toText();
    let target = messages.find(func(m : Message) : Bool { m.id == messageId });
    switch (target) {
      case (null) { false };
      case (?msg) {
        if (msg.receiverId == callerId) {
          messages := messages.map(func(m : Message) : Message {
            if (m.id == messageId) { { m with isRead = true } } else { m };
          });
          true;
        } else {
          false;
        };
      };
    };
  };

  // ========================
  // REVIEWS
  // ========================

  type Review = {
    id : Text;
    authorId : Text;
    targetId : Text;
    targetType : Text;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

  var reviews : [Review] = [];
  var nextReviewId : Nat = 1;

  public shared ({ caller }) func createReview(targetId : Text, targetType : Text, rating : Nat, comment : Text) : async Text {
    let id = "rev-" # nextReviewId.toText();
    nextReviewId += 1;
    let review : Review = {
      id = id;
      authorId = caller.toText();
      targetId = targetId;
      targetType = targetType;
      rating = rating;
      comment = comment;
      createdAt = Time.now();
    };
    reviews := reviews.concat([review]);
    id;
  };

  public query func getPropertyReviews(propertyId : Text) : async [Review] {
    reviews.filter(func(r : Review) : Bool {
      r.targetId == propertyId and r.targetType == "property";
    });
  };

  public query func getUserReviews(userId : Text) : async [Review] {
    reviews.filter(func(r : Review) : Bool {
      r.targetId == userId and r.targetType == "user";
    });
  };

  public shared ({ caller }) func deleteReview(reviewId : Text) : async Bool {
    let callerId = caller.toText();
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let target = reviews.find(func(r : Review) : Bool { r.id == reviewId });
    switch (target) {
      case (null) { false };
      case (?review) {
        if (review.authorId == callerId or isAdmin) {
          reviews := reviews.filter(func(r : Review) : Bool { r.id != reviewId });
          true;
        } else {
          false;
        };
      };
    };
  };
};
