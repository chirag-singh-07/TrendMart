# Delivery & Shipment System Documentation

## 1. Overview

The Delivery & Shipment System is a production-ready module designed to handle the post-order logistics lifecycle. It manages user addresses, shipment creation, automated delivery partner assignment using geospatial logic, live tracking via Redis, and real-time status updates. It integrates deeply with the Order system to ensure inventory and status consistency.

## 2. Data Models

### Address (`IAddress`)

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Reference to the buyer |
| `fullName` | String | Recipient's full name |
| `phone` | String | Contact number (Indian format) |
| `addressLine1` | String | Building/Street info |
| `city` / `state` | String | Location details |
| `postalCode` | String | 6-digit PIN code |
| `latitude` / `longitude` | Number | GPS coordinates for routing |
| `isDefault` | Boolean | Primary shipping address |

### Shipment (`IShipment`)

| Field | Type | Description |
|---|---|---|
| `orderId` | ObjectId | Linked order |
| `trackingNumber` | String | Unique TRK-XXXX identifier |
| `shipmentStatus` | Enum | Current lifecycle state |
| `deliveryPartnerId`| ObjectId | Assigned courier |
| `statusHistory` | Array | Append-only audit trail |
| `shippedAt` | Date | Pickup timestamp |
| `deliveredAt` | Date | Completion timestamp |

### Delivery Partner (`IDeliveryPartner`)

| Field | Type | Description |
|---|---|---|
| `userId` | ObjectId | Partner's account |
| `vehicleType` | Enum | bike, car, van, truck |
| `availabilityStatus`| Enum | available, busy, offline |
| `currentLocation`| Object | Last known GPS point |
| `assignedOrders` | Array | List of active shipments |

## 3. Address Management

- **Limits**: Maximum 10 addresses per user.
- **Default Behavior**: First address is auto-set to default. Setting a new default unsets others.
- **Cleanup**: Hard delete is allowed for addresses not yet referenced by placed orders. Once an order is placed, the address ID is snapshot-stored.

## 4. Shipment Lifecycle

### Status Flow

`pending` -> `packed` -> `picked_up` -> `in_transit` -> `out_for_delivery` -> `delivered`

### Valid Transitions & Permissions

| From | To | Role | Action |
|---|---|---|---|
| `pending` | `packed` | Seller/Admin | Item is boxed |
| `packed` | `picked_up` | Partner/Admin | Handed to courier |
| `picked_up` | `in_transit` | Partner/Admin | Moving to hub |
| `in_transit` | `out_for_delivery`| Partner/Admin | Last mile start |
| `out_for_delivery`| `delivered` | Partner/Admin | Successful handover |
| `any < picked_up`| `returned` | Admin | Cancellation/Return |

## 5. Delivery Partner Assignment

- **Auto-Assignment**: Uses the Haversine formula to find the closest "available" partner to the delivery address. 
- **Manual Assignment**: Admin can override and pick a specific partner from suggestions.
- **Capacity**: Partners are marked `busy` once they reach 3 active assignments or have 5 pending orders.

## 6. Live Location Tracking

- **Redis Buffer**: Partners push GPS updates every 30s to Redis (`location:<id>`).
- **MongoDB Sync**: To prevent DB thrashing, locations are synced to MongoDB every 10 updates (Redis counter sync).
- **Public Tracking**: The tracking endpoint is public and uses fresh Redis data for high-accuracy live location display.

## 7. ETA Calculation

- **Logic**: `Distance / Avg Speed + 10min Buffer`.
- **Assumed Speeds**: 
    - Bike: 30 km/h
    - Car: 40 km/h
    - Truck: 25 km/h
- **Refresh**: ETA is recalculated on every status change or manually requested via live tracking.

## 8. Failed Delivery Handling

- **Retries**: Up to 3 delivery attempts allowed.
- **Auto-Return**: If the 3rd attempt fails, the shipment is automatically marked as `returned` and the admin is notified.

## 9. Caching Strategy

| Key | Type | TTL | Purpose |
|---|---|---|---|
| `location:<partnerId>` | String | 5 Min | Live GPS point |
| `eta:<shipmentId>` | String | 5 Min | Pre-calculated delivery time |
| `cache:tracking:<num>`| String | 30 Sec | Public tracking info buffer |
| `delivery:available:partners`| String | 1 Min | List of ready-to-work partners |

## 10. API Reference

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/api/shipments` | Admin | Create shipment |
| PATCH | `/api/shipments/:id/status`| Partner/Admin | Update delivery status |
| GET | `/api/track/:number`| Public | Live tracking info |
| POST | `/api/delivery-partners/me/location`| Partner | Push GPS ping |
| GET | `/api/addresses` | Buyer | Manage saved addresses |

## 11. Role-Based Access

- **Buyer**: Can only see tracking and manage own addresses.
- **Seller**: Can manage shipments belonging to their items and update status to `packed`.
- **Partner**: Can update live location and delivery status from `picked_up` to `delivered`.
- **Admin**: Full control over all shipments, assignments, and partner profiles.

## 12. Error Reference

| Code | Message | Scenario |
|---|---|---|
| 404 | Shipment not found | Invalid ID or tracking number |
| 400 | Invalid status transition | Trying to jump from pending to delivered |
| 403 | Access denied | Non-owner trying to modify address |
| 503 | No partners available| Auto-assignment failed due to lack of couriers |
