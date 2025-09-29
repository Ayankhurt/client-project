📌 Custom Fields Service (NestJS + Prisma)
🔹 Overview

Ye microservice entities (Tracking, Orders, Quotations, Items, Documents, etc.) ke liye Notion-style dynamic fields provide karta hai.
Aap easily naye fields define kar sakte ho, assign kar sakte ho aur unka data (values, filters, aggregates) manage kar sakte ho.

⚙️ Setup Instructions
1. Clone & Install
git clone <repo-url>
cd custom-fields-service
npm install

2. Configure Database (PostgreSQL)

Create .env file:

DATABASE_URL="postgresql://username:password@localhost:5432/custom_fields_db"

3. Run Migrations
npx prisma migrate dev --name init

4. Start Server
npm run start:dev


API will run at:
👉 http://localhost:3000/api/v1

Swagger Docs:
👉 http://localhost:3000/api/docs

📚 API Endpoints
1️⃣ Field Definitions
Method	Endpoint	Description
POST	/definitions	Create new field definition
GET	/definitions	Get all field definitions
GET	/definitions/:id	Get single field definition
PATCH	/definitions/:id	Update field definition
DELETE	/definitions/:id	Delete field definition
2️⃣ Field Assignments
Method	Endpoint	Description
POST	/assignments	Assign field to entity
GET	/assignments	Get all assignments (filter by entityType)
GET	/assignments/:id	Get single assignment
PATCH	/assignments/:id	Update assignment
DELETE	/assignments/:id	Delete assignment
3️⃣ Schema
Method	Endpoint	Description
GET	/schema?entityType=Order	Get schema with latest field definitions
4️⃣ Values
Method	Endpoint	Description
POST	/values	Create single field value
POST	/values/batch	Create multiple values for entity
GET	/values	Get values (filters: entityType, entityIds, grouped)
GET	/values/:id	Get single value
PATCH	/values/:id	Update value
DELETE	/values/:id	Delete value
5️⃣ Filters
Method	Endpoint	Description
POST	/filters/search	Search entities with conditions

Request Example:

{
  "entityType": "Order",
  "conditions": [
    { "fieldCode": "status", "operator": "eq", "value": "delivered" },
    { "fieldCode": "amount", "operator": "gt", "value": 1000 }
  ]
}

6️⃣ Aggregates
Method	Endpoint	Description
GET	/aggregates/:entityType/:fieldCode	Get field aggregations

Example Response:

{
  "fieldCode": "status",
  "entityType": "Order",
  "aggregations": [
    { "value": "pending", "count": 5 },
    { "value": "delivered", "count": 12 }
  ],
  "total": 17,
  "fieldDefinition": {
    "id": "uuid",
    "code": "status",
    "name": "Order Status",
    "type": "select"
  }
}

🛠 Tech Stack

NestJS – backend framework

Prisma – ORM

PostgreSQL – database

Swagger – API docs

Class-validator – DTO validation
