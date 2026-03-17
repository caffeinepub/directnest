import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_header {
    value: string;
    name: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarKey: string;
    verificationStatus: string;
    bio: string;
    createdAt: bigint;
    updatedAt: bigint;
}

export interface UserProfileInput {
    name: string;
    email: string;
    phone: string;
    role: string;
    avatarKey: string;
    bio: string;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    propertyId: string;
    content: string;
    createdAt: bigint;
    isRead: boolean;
}

export interface Review {
    id: string;
    authorId: string;
    targetId: string;
    targetType: string;
    rating: bigint;
    comment: string;
    createdAt: bigint;
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
    imageKeys: Array<string>;
    bedrooms: bigint;
    bathrooms: bigint;
    sizeSqm: bigint;
    amenities: Array<string>;
    ownerId: string;
    agentId: string;
    status: string;
    createdAt: bigint;
}

export interface PropertyInput {
    title: string;
    price: bigint;
    locationState: string;
    locationCity: string;
    locationArea: string;
    propertyType: string;
    listingFor: string;
    description: string;
    imageKeys: Array<string>;
    bedrooms: bigint;
    bathrooms: bigint;
    sizeSqm: bigint;
    amenities: Array<string>;
    agentId: string;
}

export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    // User Profile
    createOrUpdateUserProfile(input: UserProfileInput): Promise<string>;
    getMyProfile(): Promise<Option<UserProfile>>;
    getUserProfile(userId: string): Promise<Option<UserProfile>>;
    getAllUsers(): Promise<Array<UserProfile>>;
    // Messages
    sendMessage(receiverId: string, propertyId: string, content: string): Promise<string>;
    getMyMessages(): Promise<Array<Message>>;
    getConversation(otherUserId: string): Promise<Array<Message>>;
    markMessageRead(messageId: string): Promise<boolean>;
    // Reviews
    createReview(targetId: string, targetType: string, rating: bigint, comment: string): Promise<string>;
    getPropertyReviews(propertyId: string): Promise<Array<Review>>;
    getUserReviews(userId: string): Promise<Array<Review>>;
    deleteReview(reviewId: string): Promise<boolean>;
}
